import { createReporter } from "$g_a";
import { MiddlewareHandlerContext } from "$fresh/server.ts";

const ga = createReporter({ id: "G-5SVZ0B41GD" });

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  let err;
  let res: Response;
  const start = performance.now();
  try {
    const resp = await ctx.next();
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
    ga(
      req,
      ctx,
      res!,
      start,
      err,
    );
  }
};
