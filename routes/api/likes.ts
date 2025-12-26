/// <reference lib="deno.unstable" />
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
    type KvWrapper = { value: bigint };
    const raw = entry.value;

    // entry.value can be a number, bigint, or a wrapper object like Deno.KvU64.
    // Narrow types safely without `any`.
    const isKvWrapper = (v: unknown): v is KvWrapper => (
      typeof v === "object" && v !== null &&
      typeof (v as KvWrapper).value === "bigint"
    );

    let count: number | bigint = 0;
    if (typeof raw === "bigint" || typeof raw === "number") {
      count = raw as number | bigint;
    } else if (isKvWrapper(raw)) {
      count = raw.value;
    }

    // Convert bigint to number for JSON serialization. If counts could exceed
    // Number.MAX_SAFE_INTEGER, consider returning a string instead.
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
    // Use a primitive bigint for the sum mutation so the stored value is a
    // primitive (bigint) instead of a Kv wrapper object.
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
