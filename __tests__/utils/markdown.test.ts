import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { parsePost } from "../../scripts/content.ts";
import {
  __handleDidCache,
  renderMarkdown,
  resolveDid,
} from "../../src/lib/content/markdown.ts";
import type { Heading } from "../../src/lib/types.ts";

beforeEach(() => __handleDidCache.clear());
afterEach(() => __handleDidCache.clear());
describe("Bluesky resolution", () => {
  it("reuses pending handle lookups and skips lookups for DIDs", async (t) => {
    const fetch = t.mock.method(globalThis, "fetch", async () =>
      Response.json({ did: "did:plc:12345" }),
    );
    assert.deepEqual(
      await Promise.all([
        resolveDid("user.bsky.social"),
        resolveDid("user.bsky.social"),
      ]),
      ["did:plc:12345", "did:plc:12345"],
    );
    assert.equal(await resolveDid("did:plc:already"), "did:plc:already");
    assert.equal(fetch.mock.callCount(), 1);
    assert.ok(fetch.mock.calls[0].arguments[1]?.signal instanceof AbortSignal);
  });
  for (const kind of ["HTTP", "network", "timeout", "invalid response"]) {
    it(`falls back on ${kind} failure`, async (t) => {
      t.mock.method(globalThis, "fetch", async () => {
        if (kind === "HTTP") return new Response(null, { status: 404 });
        if (kind === "invalid response") return Response.json({ did: 12 });
        throw new Error(kind);
      });
      assert.equal(await resolveDid("user.bsky.social"), null);
      const html = await renderMarkdown(
        "https://bsky.app/profile/user.bsky.social/post/abc",
      );
      assert.ok(
        html.includes(
          'href="https://bsky.app/profile/user.bsky.social/post/abc"',
        ),
      );
      assert.ok(!html.includes("bsky-embed-frame"));
    });
  }
});
describe("Markdown compatibility", () => {
  it("retains GFM, heading IDs, inline headings, and raw HTML", async () => {
    const headings: Heading[] = [];
    const html = await renderMarkdown(
      '# Heading 1\n\n## **Heading** 2\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n<iframe src="https://www.youtube.com/embed/test"></iframe>',
      headings,
    );
    assert.deepEqual(headings, [
      { level: 1, text: "Heading 1", slug: "heading-1" },
      { level: 2, text: "<strong>Heading</strong> 2", slug: "heading-2" },
    ]);
    assert.ok(html.includes('<h1 id="heading-1">'));
    assert.ok(html.includes("<table>"));
    assert.ok(
      html.includes('<iframe src="https://www.youtube.com/embed/test">'),
    );
  });
  for (const link of [
    "https://x.com/user/status/12345?s=20",
    "[Post](https://twitter.com/user/status/12345)",
    "https://x.com/i/web/status/12345",
  ]) {
    it(`renders the X embed for ${link}`, async () => {
      assert.ok(
        (await renderMarkdown(link)).includes(
          'src="https://platform.twitter.com/embed/Tweet.html?id=12345&dnt=true"',
        ),
      );
      assert.ok(
        !(await renderMarkdown(link, [], { skipEmbeds: true })).includes(
          "x-embed-frame",
        ),
      );
    });
  }
  it("renders Bluesky DID embeds and leaves mixed-link paragraphs intact", async () => {
    const url = "https://bsky.app/profile/did:plc:test/post/abc";
    assert.ok(
      (await renderMarkdown(url)).includes(
        'data-bsky-id="bsky-did-plc-test-abc"',
      ),
    );
    assert.ok(
      !(
        await renderMarkdown(`[Other](https://example.com)\n[Bluesky](${url})`)
      ).includes("bsky-embed-frame"),
    );
  });
  it("normalizes front matter and distinguishes article HTML from feed HTML", async () => {
    const post = await parsePost(
      "2025/01/01/sample",
      "---\ntitle: Test Post\ndate: '2025-01-01T12:00:00+09:00'\ncategories: [life]\nsnippet: Custom snippet\n---\n# Heading\n\nhttps://x.com/user/status/12345",
    );
    assert.equal(post.publishedAt, "2025-01-01T03:00:00.000Z");
    assert.equal(post.category, "life");
    assert.equal(post.snippet, "Custom snippet");
    assert.ok(post.html.includes("x-embed-frame"));
    assert.ok(!post.feedHtml.includes("x-embed-frame"));
    assert.equal(post.headings.length, 1);
  });
  it("reports invalid metadata before generating broken pages", async () => {
    await assert.rejects(
      parsePost("bad", "No front matter"),
      /Missing front matter/,
    );
    await assert.rejects(
      parsePost("bad", "---\ntitle: Test\ndate: nope\n---\nBody"),
      /Invalid date/,
    );
  });
});
