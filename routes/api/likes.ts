import { Handlers } from "fresh/compat";

const kv = await Deno.openKv();

export const handler: Handlers = {
  async GET(ctx) {
    const req = ctx.req;
    const slug = new URL(req.url).searchParams.get("slug");
    if (!slug) {
      return new Response("slug is required", { status: 400 });
    }
    const entry = await kv.get<number>(["likes", slug]);
    const count = entry.value ?? 0;
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
    await kv.atomic()
      .mutate({
        type: "sum",
        key: ["likes", slug],
        value: new Deno.KvU64(delta),
      })
      .commit();
    return new Response("ok");
  },
};
