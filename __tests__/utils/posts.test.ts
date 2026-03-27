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

  it("renders headings with anchor ids", () => {
    const html = renderMarkdown("# Heading 1\n\n## Heading 2");

    assertEquals(html.includes('<h1 id="heading-1">Heading 1</h1>'), true);
    assertEquals(html.includes('<h2 id="heading-2">Heading 2</h2>'), true);
  });
});
