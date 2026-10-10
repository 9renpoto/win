import assert from "node:assert/strict";
import { it } from "node:test";

const assertEquals = (a: unknown, b: unknown) => assert.deepEqual(a, b);
const assertStringIncludes = (a: string, b: string) => assert.ok(a.includes(b));

import { GET } from "../../src/routes/rss.xml/+server.ts";

it("rss handler returns valid RSS feed", async () => {
  const request = new Request("http://127.0.0.1/rss.xml");

  const response = await GET({ request } as Parameters<typeof GET>[0]);

  assertEquals(response.status, 200);
  const body = await response.text();
  assertStringIncludes(body, "<rss xmlns:blogChannel=");
  assertStringIncludes(
    body,
    'xmlns:content="http://purl.org/rss/1.0/modules/content/"',
  );
  assertStringIncludes(body, "<channel>");
  assertStringIncludes(body, "<content:encoded><![CDATA[");
  assertStringIncludes(body, "]]></content:encoded>");
  assertStringIncludes(body, "<language>ja</language>");
});

it("rss handler infers domain from request URL", async () => {
  const request = new Request("https://example.com/rss.xml");

  const response = await GET({ request } as Parameters<typeof GET>[0]);

  assertEquals(response.status, 200);
  const body = await response.text();
  assertStringIncludes(body, "<link>https://example.com</link>");
});

it("rss handler honors forwarded proto with host header", async () => {
  const headers = new Headers({
    host: "example.com",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  const response = await GET({ request } as Parameters<typeof GET>[0]);

  assertEquals(response.status, 200);
  const body = await response.text();
  assertStringIncludes(body, "<link>https://example.com</link>");
});
