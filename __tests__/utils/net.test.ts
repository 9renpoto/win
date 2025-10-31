import { assertEquals } from "@std/assert";
import { getDomainUrl } from "@/utils/net.ts";

Deno.test("getDomainUrl falls back to request URL origin", () => {
  const request = new Request("https://example.com/rss.xml");

  assertEquals(getDomainUrl(request), "https://example.com");
});

Deno.test("getDomainUrl prefers forwarded host headers", () => {
  const headers = new Headers({
    "X-Forwarded-Host": "blog.test",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "https://blog.test");
});

Deno.test("getDomainUrl respects forwarded proto with host header", () => {
  const headers = new Headers({
    "host": "example.com",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "https://example.com");
});
