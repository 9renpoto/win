import { assertEquals } from "@std/assert";
import { handler } from "@/routes/api/likes.ts";

Deno.test("GET returns 400 without slug", async () => {
  const request = new Request("http://127.0.0.1/api/likes");

  const response = await (handler as unknown as {
    GET: (ctx: { req: Request }) => Promise<Response>;
  }).GET({ req: request });

  assertEquals(response.status, 400);
});

Deno.test("GET returns count as number when stored as KvU64", async () => {
  const kv = await Deno.openKv();
  await kv.set(["likes", "test-slug-bigint"], new Deno.KvU64(2n));

  const request = new Request(
    "http://127.0.0.1/api/likes?slug=test-slug-bigint",
  );

  const response = await (handler as unknown as {
    GET: (ctx: { req: Request }) => Promise<Response>;
  }).GET({ req: request });

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(typeof json.count, "number");
  assertEquals(json.count, 2);
});

Deno.test("POST like increments count", async () => {
  const kv = await Deno.openKv();
  await kv.set(["likes", "test-slug-post"], new Deno.KvU64(0n));

  const request = new Request("http://127.0.0.1/api/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: "test-slug-post", action: "like" }),
  });

  const response = await (handler as unknown as {
    POST: (ctx: { req: Request }) => Promise<Response>;
  }).POST({ req: request });

  assertEquals(response.status, 200);

  const entry = await kv.get(["likes", "test-slug-post"]);
  const val = entry.value;
  assertEquals(typeof val === "bigint" ? Number(val) : val, 1);
});
