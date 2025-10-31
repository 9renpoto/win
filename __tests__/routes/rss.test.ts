import { assertEquals, assertStringIncludes } from "@std/assert";
import { handler } from "@/routes/rss.xml.ts";

Deno.test("rss handler returns valid RSS feed", async () => {
  const request = new Request("http://127.0.0.1/rss.xml");

  const response = await (handler as unknown as {
    GET: (ctx: { req: Request }) => Promise<Response>;
  }).GET({ req: request });

  assertEquals(response.status, 200);
  const body = await response.text();
  assertStringIncludes(body, "<rss xmlns:blogChannel=");
  assertStringIncludes(body, "<channel>");
});

Deno.test("rss handler infers domain from request URL", async () => {
  const request = new Request("https://example.com/rss.xml");

  const response = await (handler as unknown as {
    GET: (ctx: { req: Request }) => Promise<Response>;
  }).GET({ req: request });

  assertEquals(response.status, 200);
  const body = await response.text();
  assertStringIncludes(body, "<link>https://example.com</link>");
});

Deno.test("rss handler honors forwarded proto with host header", async () => {
  const headers = new Headers({
    "host": "example.com",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  const response = await (handler as unknown as {
    GET: (ctx: { req: Request }) => Promise<Response>;
  }).GET({ req: request });

  assertEquals(response.status, 200);
  const body = await response.text();
  assertStringIncludes(body, "<link>https://example.com</link>");
});
