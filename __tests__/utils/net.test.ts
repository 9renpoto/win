import { assertEquals, assertThrows } from "@std/assert";
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

Deno.test("getDomainUrl falls back to http for localhost in forwarded host", () => {
  const headers = new Headers({
    "X-Forwarded-Host": "localhost:8000",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "http://localhost:8000");
});

Deno.test("getDomainUrl respects forwarded proto with host header", () => {
  const headers = new Headers({
    host: "example.com",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "https://example.com");
});

Deno.test("getDomainUrl handles localhost in host header without forwarded proto", () => {
  const headers = new Headers({
    host: "localhost:8000",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "http://localhost:8000");
});

Deno.test("getDomainUrl handles non-localhost host header without forwarded proto", () => {
  const headers = new Headers({
    host: "example.com",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "https://example.com");
});

Deno.test("getDomainUrl throws when domain URL cannot be determined", () => {
  const request = new Request("about:blank");
  assertThrows(
    () => getDomainUrl(request),
    Error,
    "Could not determine domain URL.",
  );
});
