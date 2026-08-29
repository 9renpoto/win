/// <reference lib="deno.unstable" />
import { assertEquals } from "@std/assert";
import { handler } from "@/routes/api/likes.ts";

Deno.test("GET returns 400 without slug", async () => {
  const request = new Request("http://127.0.0.1/api/likes");

  const response = await (
    handler as unknown as {
      GET: (ctx: { req: Request }) => Promise<Response>;
    }
  ).GET({ req: request });

  assertEquals(response.status, 400);
});

Deno.test("GET returns count as number when stored as KvU64", async () => {
  const kv = await Deno.openKv();
  await kv.set(["likes", "test-slug-bigint"], new Deno.KvU64(2n));

  const request = new Request(
    "http://127.0.0.1/api/likes?slug=test-slug-bigint",
  );

  const response = await (
    handler as unknown as {
      GET: (ctx: { req: Request }) => Promise<Response>;
    }
  ).GET({ req: request });

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(typeof json.count, "number");
  assertEquals(json.count, 2);
  await kv.close();
});

Deno.test("GET returns count as number when stored as primitive bigint or number", async () => {
  const kv = await Deno.openKv();
  await kv.set(["likes", "test-slug-primitive-bigint"], 5n);

  const request = new Request(
    "http://127.0.0.1/api/likes?slug=test-slug-primitive-bigint",
  );

  const response = await (
    handler as unknown as {
      GET: (ctx: { req: Request }) => Promise<Response>;
    }
  ).GET({ req: request });

  assertEquals(response.status, 200);
  const json = await response.json();
  assertEquals(json.count, 5);

  await kv.set(["likes", "test-slug-number"], 10);
  const request2 = new Request(
    "http://127.0.0.1/api/likes?slug=test-slug-number",
  );
  const response2 = await (
    handler as unknown as {
      GET: (ctx: { req: Request }) => Promise<Response>;
    }
  ).GET({ req: request2 });

  assertEquals(response2.status, 200);
  const json2 = await response2.json();
  assertEquals(json2.count, 10);

  await kv.close();
});

Deno.test("POST returns 400 without slug", async () => {
  const request = new Request("http://127.0.0.1/api/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "like" }),
  });

  const response = await (
    handler as unknown as {
      POST: (ctx: { req: Request }) => Promise<Response>;
    }
  ).POST({ req: request });

  assertEquals(response.status, 400);
});

Deno.test("POST like and unlike updates count", async () => {
  const kv = await Deno.openKv();
  await kv.set(["likes", "test-slug-post"], new Deno.KvU64(0n));

  const requestLike = new Request("http://127.0.0.1/api/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: "test-slug-post", action: "like" }),
  });

  const responseLike = await (
    handler as unknown as {
      POST: (ctx: { req: Request }) => Promise<Response>;
    }
  ).POST({ req: requestLike });

  assertEquals(responseLike.status, 200);

  const requestUnlike = new Request("http://127.0.0.1/api/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug: "test-slug-post", action: "unlike" }),
  });

  const responseUnlike = await (
    handler as unknown as {
      POST: (ctx: { req: Request }) => Promise<Response>;
    }
  ).POST({ req: requestUnlike });

  assertEquals(responseUnlike.status, 200);

  await kv.close();
});
