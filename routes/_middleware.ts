import type { FreshContext } from "$fresh/server.ts";
import type { Event, PrimaryEvent } from "$ga4";
import { GA4Report, isDocument, isServerError } from "$ga4";

const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");

let showedMissingEnvWarning = false;

function ga4(
  request: Request,
  conn: FreshContext,
  response: Response,
  _start: number,
  error?: unknown,
) {
  if (GA4_MEASUREMENT_ID === undefined) {
    if (!showedMissingEnvWarning) {
      showedMissingEnvWarning = true;
      console.warn(
        "GA4_MEASUREMENT_ID environment variable not set. Google Analytics reporting disabled.",
      );
    }
    return;
  }
  Promise.resolve()
    .then(async () => {
      // We're tracking page views and file downloads. These are the only two
      // HTTP methods that _might_ be used.
      if (!/^(GET|POST)$/.test(request.method)) {
        return;
      }

      // If the visitor is using a web browser, only create events when we serve
      // a top level documents or download; skip assets like css, images, fonts.
      if (!isDocument(request, response) && error == null) {
        return;
      }

      let event: Event | null = null;
      const contentType = response.headers.get("content-type");
      if (contentType && /text\/html/.test(contentType)) {
        event = { name: "page_view", params: {} }; // Probably an old browser.
      }

      if (event == null && error == null) {
        return;
      }

      // If an exception was thrown, build a separate event to report it.
      let exceptionEvent: PrimaryEvent | null;
      if (error != null) {
        exceptionEvent = {
          name: "exception",
          params: {
            description: String(error),
            fatal: isServerError(response),
          },
        };
      } else {
        exceptionEvent = null;
      }
      const userAgents: Array<string | null> = [
        "textlint-rule-no-dead-link/1.0",
      ];
      if (userAgents.includes(request.headers.get("user-agent"))) {
        return;
      }
      if (conn.url.pathname === "/healthz") {
        return;
      }
      if (response.status === 404) {
        return;
      }

      // Create basic report.
      const measurementId = GA4_MEASUREMENT_ID;
      const report = new GA4Report({
        measurementId,
        request,
        response,
        conn: {
          localAddr: conn.localAddr as Deno.Addr,
          remoteAddr: conn.remoteAddr,
        },
      });

      // Override the default (page_view) event.
      report.event = event;

      // Add the exception event, if any.
      if (exceptionEvent != null) {
        report.events.push(exceptionEvent);
      }

      await report.send();
    })
    .catch((err) => {
      console.error(`Internal error: ${err}`);
    });
}

export async function handler(
  req: Request,
  conn: FreshContext,
): Promise<Response> {
  let err: unknown;
  let res = new Response("Internal Server Error", {
    status: 500,
  });
  const start = performance.now();
  try {
    const resp = await conn.next();
    const headers = new Headers(resp.headers);
    res = new Response(resp.body, { status: resp.status, headers });
    return res;
  } catch (e) {
    res = new Response("Internal Server Error", {
      status: 500,
    });
    err = e;
    throw e;
  } finally {
    ga4(req, conn, res, start, err);
  }
}
