import type { FreshContext } from "$fresh/server.ts";

export function handler(
  _req: Request,
  ctx: FreshContext,
): Promise<Response> {
  return ctx.next();
}
