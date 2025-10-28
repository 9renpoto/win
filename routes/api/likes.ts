import { Handlers } from "fresh/compat";
import { createKvU64, getKv, kvAvailable } from "@/utils/kv-support.ts";

const kv = kvAvailable ? await getKv() : null;

export const handler: Handlers = {
  async GET(ctx) {
    if (!kv) {
      return new Response("KV is unavailable", { status: 503 });
    }
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
    if (!kv) {
      return new Response("KV is unavailable", { status: 503 });
    }
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
        value: createKvU64(delta),
      })
      .commit();
    return new Response("ok");
  },
};
