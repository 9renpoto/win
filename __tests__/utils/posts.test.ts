import { getPost } from "@/utils/posts.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { basename, dirname } from "@std/path";

describe("getPost", () => {
  it("should extract headings from markdown", async () => {
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
});
