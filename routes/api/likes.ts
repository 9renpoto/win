import type { RouteHandler } from "fresh";

const kv = await Deno.openKv();

export const handler: RouteHandler<Response, Record<string, never>> = {
  async GET(ctx) {
    const req = ctx.req;
    const slug = new URL(req.url).searchParams.get("slug");
    if (!slug) {
      return new Response("slug is required", { status: 400 });
    }
    const entry = await kv.get(["likes", slug]);
    let count: number | bigint = entry.value ?? 0;
    // Kv may store values as BigInt (e.g. Deno.KvU64). Convert BigInt to number
    // for JSON serialization. If counts could exceed Number.MAX_SAFE_INTEGER,
    // consider returning a string instead.
    if (typeof count === "bigint") {
      count = Number(count);
    }
    return new Response(JSON.stringify({ count }), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async POST(ctx) {
    const req = ctx.req;
    const { slug, action } = await req.json();
    if (!slug) {
      return new Response("slug is required", { status: 400 });
    }

    const delta = action === "like" ? 1n : -1n;
    await kv
      .atomic()
      .mutate({
        type: "sum",
        key: ["likes", slug],
        value: new Deno.KvU64(delta),
      })
      .commit();
    return new Response("ok");
  },
};
