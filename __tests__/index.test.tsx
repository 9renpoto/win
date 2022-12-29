import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.148.0/testing/bdd.ts";
import { assertExists, DOMParser, render } from "./deps.ts";

import { PostCard } from "../routes/index.tsx";

describe("PostCard", () => {
  beforeEach(() => {
    window.document = new DOMParser().parseFromString(
      "",
      "text/html",
    ) as unknown as HTMLDocument;
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
