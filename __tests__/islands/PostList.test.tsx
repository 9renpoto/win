import { assertEquals, assert } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import PostList from "@/islands/PostList.tsx";

describe("PostList", () => {
  it("renders initial posts and load more button when hasMore is true", () => {
    const initialPosts = [
      {
        slug: "post-1",
        title: "Post 1",
        publishedAt: "2024-01-01T00:00:00.000Z",
        snippet: "Snippet 1",
      },
    ];

    const { getByText } = render(
      <PostList initialPosts={initialPosts} initialHasMore={true} />,
    );

    assert(getByText("Post 1"));
    assert(getByText("Load more"));
  });

  it("does not render load more button when hasMore is false", () => {
    const initialPosts = [
      {
        slug: "post-1",
        title: "Post 1",
        publishedAt: "2024-01-01T00:00:00.000Z",
        snippet: "Snippet 1",
      },
    ];

    const { queryByText } = render(
      <PostList initialPosts={initialPosts} initialHasMore={false} />,
    );

    assertEquals(queryByText("Load more"), null);
  });
});
