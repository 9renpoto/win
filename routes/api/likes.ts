/// <reference lib="deno.unstable" />
import type { RouteHandler } from "fresh";

// Wrapper type for Kv wrapper objects (e.g. Deno.KvU64)
type KvWrapper = { value: bigint };

const kv = await Deno.openKv();

export const handler: RouteHandler<Response, Record<string, never>> = {
  async GET(ctx) {
    const req = ctx.req;
    const slug = new URL(req.url).searchParams.get("slug");
    if (!slug) {
      return new Response("slug is required", { status: 400 });
    }
    const entry = await kv.get(["likes", slug]);
    // entry.value may be {} according to the inferred types; narrow it to number | bigint
    let count: number | bigint = (entry.value as number | bigint) ?? 0;
    // Kv may store values as BigInt (e.g. Deno.KvU64) or wrapper objects
    // with a `value` field that is a BigInt. Normalize to a number for JSON
    // serialization. If counts could exceed Number.MAX_SAFE_INTEGER,
    // consider returning a string instead.
    if (typeof count === "bigint") {
      count = Number(count);
    } else if (
      typeof count === "object" && count !== null &&
      typeof (count as KvWrapper).value === "bigint"
    ) {
      count = Number((count as KvWrapper).value);
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
        value: delta as unknown as Deno.KvU64,
      })
      .commit();
    return new Response("ok");
  },
};
