import type { FreshContext } from "fresh";

export function handler(ctx: FreshContext): Promise<Response> {
  return ctx.next();
}
