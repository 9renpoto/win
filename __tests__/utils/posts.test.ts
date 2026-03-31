import { assert, assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { FakeTime } from "@std/testing/time";
import { basename, dirname } from "@std/path";
import * as postsUtil from "@/utils/posts.ts";
import { getPost, renderMarkdown } from "@/utils/posts.ts";
import { stub } from "@std/testing/mock";

export function stubDidFetch(did = "did:plc:z72i7hdynmk6r22z27h6tvur") {
  return stub(
    globalThis,
    "fetch",
    () =>
      Promise.resolve(
        new Response(JSON.stringify({ did }), {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }),
      ),
  );
}

describe("resolveDid", () => {
  beforeEach(() => {
    postsUtil.__handleDidCache?.clear();
  });
  afterEach(() => {
    postsUtil.__handleDidCache?.clear();
  });

  it("resolves handle to DID (success)", async () => {
    const time = new FakeTime();
    const localStub = stubDidFetch("did:plc:12345");
    const did = await postsUtil.resolveDid("user.bsky.social");
    assertEquals(did, "did:plc:12345");
    localStub.restore();
    time.runAll();
    time.restore();
  });

  it("returns null on non-OK response", async () => {
    const time = new FakeTime();
    const localStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(new Response(null, { status: 404 })),
    );
    const did = await postsUtil.resolveDid("user.bsky.social");
    assertEquals(did, null);
    localStub.restore();
    time.runAll();
    time.restore();
  });

  it("returns null on network error", async () => {
    const time = new FakeTime();
    const localStub = stub(globalThis, "fetch", () => Promise.reject(new Error("network")));
    const did = await postsUtil.resolveDid("user.bsky.social");
    assertEquals(did, null);
    localStub.restore();
    time.runAll();
    time.restore();
  });

  it("resolves handle to DID (stub)", async () => {
    const time = new FakeTime();
    const localStub = stubDidFetch("did:plc:z72i7hdynmk6r22z27h6tvur");
    const did = await postsUtil.resolveDid("user.bsky.social");
    assertEquals(did, "did:plc:z72i7hdynmk6r22z27h6tvur");
    localStub.restore();
    time.runAll();
    time.restore();
  });

  // Removed legacy fake time test; fetch mocking is now handled by stubDidFetch
});

describe("getPost", () => {
  it("extracts headings from markdown", async () => {
    // Use markdown front-matter for test
    const markdown = [
      "---",
      "title: Test Post",
      "date: 2025-01-01",
      "---",
      "",
      "# Heading 1",
      "## Heading 2",
      "### Heading 3",
      "",
    ].join("\n");

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

    assert(html.includes('<h1 id="heading-1">Heading 1</h1>'));
    assert(html.includes('<h2 id="heading-2">Heading 2</h2>'));
  });

  it("renders x.com status url as embedded iframe", async () => {
    const html = await renderMarkdown(
      "https://x.com/jezailfunder_jp/status/2024795594045505688?s=20",
    );

    assert(
      html.includes(
        'src="https://platform.twitter.com/embed/Tweet.html?id=2024795594045505688&dnt=true"',
      ),
    );
    assert(html.includes('class="x-embed-frame"'));
  });

  it("renders markdown link to x.com status as embedded iframe", async () => {
    const html = await renderMarkdown(
      "[Jiffy75](https://x.com/jezailfunder_jp/status/2024795594045505688)",
    );

    assert(
      html.includes(
        'src="https://platform.twitter.com/embed/Tweet.html?id=2024795594045505688&dnt=true"',
      ),
    );
    assert(html.includes('<div class="x-embed"><iframe class="x-embed-frame"'));
  });

  it("renders x.com i/web/status url as embedded iframe", async () => {
    const html = await renderMarkdown(
      "https://x.com/i/web/status/2024795594045505688?s=20",
    );

    assert(
      html.includes(
        'src="https://platform.twitter.com/embed/Tweet.html?id=2024795594045505688&dnt=true"',
      ),
    );
    assert(html.includes('title="Embedded X post 2024795594045505688"'));
  });

  it("renders bsky.app post url as embedded iframe", async () => {
    const localStub = stubDidFetch();
    const html = await renderMarkdown(
      "https://bsky.app/profile/did:plc:z72i7hdynmk6r22z27h6tvur/post/3l6oveex3hf2v",
    );
    localStub.restore();

    assert(
      html.includes(
        'src="https://embed.bsky.app/embed/did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3hf2v?id=',
      ),
    );
    assert(html.includes('class="bsky-embed-frame"'));
    assert(
      html.includes(
        'data-bsky-id="bsky-did-plc-z72i7hdynmk6r22z27h6tvur-3l6oveex3hf2v"',
      ),
    );
  });

  it("does not embed bsky.app post if paragraph has multiple links", async () => {
    const localStub = stubDidFetch();
    const html = await renderMarkdown(
      "[HHKB Studio](https://happyhackingkb.com/jp/news/2026/news20260313.html)\n[HHKB Studio](https://bsky.app/profile/did:plc:z72i7hdynmk6r22z27h6tvur/post/3l6oveex3hf2v)",
    );
    localStub.restore();
    // 2つのリンクが同じ段落内にある場合、bsky埋め込みは発動しない
    assert(!html.includes('class="bsky-embed-frame"'));
    assert(
      html.includes(
        'href="https://happyhackingkb.com/jp/news/2026/news20260313.html"',
      ),
    );
    assert(
      html.includes(
        'href="https://bsky.app/profile/did:plc:z72i7hdynmk6r22z27h6tvur/post/3l6oveex3hf2v"',
      ),
    );
  });
});
