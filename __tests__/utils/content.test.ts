import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  markdownToText,
  searchRecords,
  toSearchRecord,
} from "../../src/lib/content/search.ts";
import { renderRss } from "../../src/lib/server/feed.ts";
import { about, getPost, posts } from "../../src/lib/server/posts.ts";

describe("compiled repository content", () => {
  it("includes every source Markdown slug in publication order", async () => {
    const directory = fileURLToPath(new URL("../../posts", import.meta.url));
    const files = await readdir(directory, {
      recursive: true,
      withFileTypes: true,
    });
    const slugs = files
      .filter((file) => file.isFile() && file.name.endsWith(".md"))
      .map((file) =>
        `${file.parentPath}/${file.name}`
          .slice(directory.length + 1)
          .replaceAll("\\", "/")
          .replace(/\.md$/, ""),
      )
      .sort();
    assert.deepEqual(posts.map((post) => post.slug).sort(), slugs);
    assert.deepEqual(
      posts.map((post) => post.publishedAt),
      posts
        .map((post) => post.publishedAt)
        .sort()
        .reverse(),
    );
    for (const post of posts) {
      const source = await readFile(`${directory}/${post.slug}.md`, "utf8");
      assert.ok(source.includes(post.content));
      assert.notEqual(post.html, "");
      assert.deepEqual(getPost(post.slug), post);
    }
    assert.equal(about.title, "About me");
    assert.ok(about.html.includes("Profile"));
    assert.equal(getPost("../about"), undefined);
    assert.equal(getPost("does-not-exist"), undefined);
  });
  it("retains link labels in searchable text and slug-based object IDs", () => {
    assert.equal(
      markdownToText("# Read [A book](https://example.com) and `code`"),
      "Read A book and code",
    );
    const record = toSearchRecord(posts[0], "https://example.com/");
    assert.equal(record.objectID, posts[0].slug);
    assert.equal(record.url, `https://example.com/entry/${posts[0].slug}`);
    assert.equal(searchRecords([record], posts[0].title).length, 1);
    assert.deepEqual(searchRecords([record], "not-a-real-query"), []);
  });
  it("escapes XML and safely splits CDATA terminators", () => {
    const post = {
      ...posts[0],
      title: "Title ]]> suffix",
      snippet: "< & >",
      feedHtml: "<p>]]></p>",
    };
    const rss = renderRss([post], "https://example.com");
    assert.ok(rss.includes("Title ]]]]><![CDATA[> suffix"));
    assert.ok(rss.includes("&lt; &amp; &gt;"));
    assert.ok(rss.includes("<p>]]]]><![CDATA[></p>"));
  });
});
