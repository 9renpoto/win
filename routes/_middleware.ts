import type { FreshContext } from "$fresh/server.ts";

export async function handler(
  _req: Request,
  ctx: FreshContext,
): Promise<Response> {
  return await ctx.next();
}
