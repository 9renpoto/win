import assert from "node:assert/strict";
import { it } from "node:test";

import { GET } from "../../src/routes/rss.xml/+server.ts";

it("rss handler returns valid RSS feed", async () => {
  const request = new Request("http://127.0.0.1/rss.xml");

  const response = await GET({ request } as Parameters<typeof GET>[0]);

  assert.equal(response.status, 200);
  const body = await response.text();
  assert.ok(body.includes("<rss xmlns:blogChannel="));
  assert.ok(
    body.includes('xmlns:content="http://purl.org/rss/1.0/modules/content/"'),
  );
  assert.ok(body.includes("<channel>"));
  assert.ok(body.includes("<content:encoded><![CDATA["));
  assert.ok(body.includes("]]></content:encoded>"));
  assert.ok(body.includes("<language>ja</language>"));
});

it("rss handler infers domain from request URL", async () => {
  const request = new Request("https://example.com/rss.xml");

  const response = await GET({ request } as Parameters<typeof GET>[0]);

  assert.equal(response.status, 200);
  const body = await response.text();
  assert.ok(body.includes("<link>https://example.com</link>"));
});

it("rss handler honors forwarded proto with host header", async () => {
  const headers = new Headers({
    host: "example.com",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  const response = await GET({ request } as Parameters<typeof GET>[0]);

  assert.equal(response.status, 200);
  const body = await response.text();
  assert.ok(body.includes("<link>https://example.com</link>"));
});
