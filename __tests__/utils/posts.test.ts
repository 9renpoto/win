import * as postsUtil from "@/utils/posts.ts";
import { afterEach, beforeEach } from "@std/testing/bdd";
describe("resolveDid", () => {
  const originalFetch = globalThis.fetch;
  beforeEach(() => {
    postsUtil.__handleDidCache?.clear();
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("resolves handle to DID (success)", async () => {
    globalThis.fetch = (_url, _opts) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ did: "did:plc:12345" }),
      } as Response);
    };
    const did = await postsUtil.resolveDid("user.bsky.social");
    assertEquals(did, "did:plc:12345");
  });

  it("returns null on non-OK response", async () => {
    globalThis.fetch = (_url, _opts) => {
      return Promise.resolve({ ok: false } as Response);
    };
    const did = await postsUtil.resolveDid("user.bsky.social");
    assertEquals(did, null);
  });

  it("returns null on network error", async () => {
    globalThis.fetch = (_url, _opts) => {
      return Promise.reject(new Error("network error"));
    };
    const did = await postsUtil.resolveDid("user.bsky.social");
    assertEquals(did, null);
  });
});
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { basename, dirname } from "@std/path";
import { getPost, renderMarkdown } from "@/utils/posts.ts";

describe("getPost", () => {
  it("extracts headings from markdown", async () => {
    const markdown = `---
title: Test Post
date: 2025-01-01
---

# Heading 1
## Heading 2
### Heading 3
`;

    const tempFile = await Deno.makeTempFile({ suffix: ".md" });
    await Deno.writeTextFile(tempFile, markdown);

    const dir = dirname(tempFile);
    const slug = basename(tempFile, ".md");

    const post = await getPost(slug, dir);
    await Deno.remove(tempFile);

    assertEquals(post.headings, [
      { level: 1, text: "Heading 1", slug: "heading-1" },
      { level: 2, text: "Heading 2", slug: "heading-2" },
      { level: 3, text: "Heading 3", slug: "heading-3" },
    ]);
  });

  it("renders headings with anchor ids", async () => {
    const html = await renderMarkdown("# Heading 1\n\n## Heading 2");

    assertEquals(html.includes('<h1 id="heading-1">Heading 1</h1>'), true);
    assertEquals(html.includes('<h2 id="heading-2">Heading 2</h2>'), true);
  });

  it("renders x.com status url as embedded iframe", async () => {
    const html = await renderMarkdown(
      "https://x.com/jezailfunder_jp/status/2024795594045505688?s=20",
    );

    assertEquals(
      html.includes(
        'src="https://platform.twitter.com/embed/Tweet.html?id=2024795594045505688&dnt=true"',
      ),
      true,
    );
    assertEquals(
      html.includes('class="x-embed-frame"'),
      true,
    );
  });

  it("renders markdown link to x.com status as embedded iframe", async () => {
    const html = await renderMarkdown(
      "[Jiffy75](https://x.com/jezailfunder_jp/status/2024795594045505688)",
    );

    assertEquals(
      html.includes(
        'src="https://platform.twitter.com/embed/Tweet.html?id=2024795594045505688&dnt=true"',
      ),
      true,
    );
    assertEquals(
      html.includes('<div class="x-embed"><iframe class="x-embed-frame"'),
      true,
    );
  });

  it("renders x.com i/web/status url as embedded iframe", async () => {
    const html = await renderMarkdown(
      "https://x.com/i/web/status/2024795594045505688?s=20",
    );

    assertEquals(
      html.includes(
        'src="https://platform.twitter.com/embed/Tweet.html?id=2024795594045505688&dnt=true"',
      ),
      true,
    );
    assertEquals(
      html.includes('title="Embedded X post 2024795594045505688"'),
      true,
    );
  });

  it("renders bsky.app post url as embedded iframe", async () => {
    const html = await renderMarkdown(
      "https://bsky.app/profile/did:plc:z72i7hdynmk6r22z27h6tvur/post/3l6oveex3hf2v",
    );

    assertEquals(
      html.includes(
        'src="https://embed.bsky.app/embed/did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3hf2v?id=',
      ),
      true,
    );
    assertEquals(html.includes('class="bsky-embed-frame"'), true);
    assertEquals(
      html.includes(
        'data-bsky-id="bsky-did-plc-z72i7hdynmk6r22z27h6tvur-3l6oveex3hf2v"',
      ),
      true,
    );
  });

  it("renders bsky.app embed when a paragraph has another link", async () => {
    const html = await renderMarkdown(
      "[HHKB Studio](https://happyhackingkb.com/jp/news/2026/news20260313.html)\n[HHKB Studio](https://bsky.app/profile/did:plc:z72i7hdynmk6r22z27h6tvur/post/3l6oveex3hf2v)",
    );

    assertEquals(
      html.includes(
        'src="https://embed.bsky.app/embed/did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3hf2v?id=',
      ),
      true,
    );
    assertEquals(
      html.includes(
        'href="https://happyhackingkb.com/jp/news/2026/news20260313.html"',
      ),
      true,
    );
  });
});
