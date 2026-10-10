import { deepStrictEqual as assertEquals } from "node:assert/strict";
import { it } from "node:test";
import { getDomainUrl } from "../../src/lib/net.ts";

it("getDomainUrl falls back to request URL origin", () => {
  const request = new Request("https://example.com/rss.xml");

  assertEquals(getDomainUrl(request), "https://example.com");
});

it("getDomainUrl prefers forwarded host headers", () => {
  const headers = new Headers({
    "X-Forwarded-Host": "blog.test",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "https://blog.test");
});

it("getDomainUrl respects forwarded proto with host header", () => {
  const headers = new Headers({
    host: "example.com",
    "X-Forwarded-Proto": "https",
  });
  const request = new Request("http://internal/rss.xml", { headers });

  assertEquals(getDomainUrl(request), "https://example.com");
});

it("uses HTTP for local loopback hosts", () => {
  for (const host of ["127.0.0.1:5173", "localhost:5173", "[::1]:5173"]) {
    assertEquals(
      getDomainUrl(
        new Request("http://127.0.0.1/rss.xml", { headers: { host } }),
      ),
      `http://${host}`,
    );
  }
});
