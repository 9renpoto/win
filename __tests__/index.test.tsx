import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";
import { assertExists } from "@std/testing/asserts";
import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { PostCard } from "@/routes/index.tsx";

describe("PostCard", () => {
  beforeAll(setup);
  afterEach(cleanup);

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
