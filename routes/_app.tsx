import { Head } from "$fresh/runtime.ts";
import { AppProps, Handlers } from "$fresh/src/server/types.ts";
import { createReporter } from "https://deno.land/x/g_a@0.1.2/mod.ts";
import type { ConnInfo } from "https://deno.land/std@0.128.0/http/server.ts";

/** this is a GA property ID we are using for this example, it is better to fork this playground and
 * set the `GA_TRACKING_ID` environment variable with your own property ID. */
const ga = createReporter({ id: "G-5SVZ0B41GD" });

const handler: Handlers = {
  async GET(req, ctx) {
    const resp = await ctx.render();
  let err;
  let res: Response;
  const start = performance.now();
  try {
    // processing of the request...
    res = new Response("Hello Google Analytics");
  } catch (e) {
    err = e;
  } finally {
    ga(req,, res!, start, err);
  }
  return resp;
  }
}


export default function App({ Component }: AppProps) {
  return (
    <html lang="ja">
      <Head>
        <title>:-) 🏕</title>
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
