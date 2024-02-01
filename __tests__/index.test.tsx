import { beforeEach, describe, it } from "$std/testing/bdd.ts";
import { assertExists } from "$std/testing/asserts.ts";
import { DOMParser, render } from "./deps.ts";

import { PostCard } from "../routes/index.tsx";

describe("PostCard", () => {
  beforeEach(() => {
    // deno-lint-ignore no-window
    window.document = new DOMParser().parseFromString(
      "",
      "text/html",
    ) as unknown as Document;
  });

  it("should exists.", () => {
    const { container } = render(
      <PostCard
        post={{
          slug: "slug",
          content: "content",
          title: "title",
          publishedAt: new Date(),
          snippet: "snippet",
        }}
      />,
    );

    assertExists(container);
  });
});
