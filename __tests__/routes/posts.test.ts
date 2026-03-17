import { assertEquals, assertInstanceOf } from "@std/assert";
import { handler } from "@/routes/api/posts.ts";

type GetHandler = {
  GET: (ctx: { req: Request }) => Promise<Response>;
};

Deno.test("GET /api/posts returns first page with hasMore", async () => {
  const request = new Request("http://127.0.0.1/api/posts");

  const response = await (handler as unknown as GetHandler).GET({
    req: request,
  });

  assertEquals(response.status, 200);
  assertEquals(
    response.headers.get("Content-Type"),
    "application/json",
  );

  const json = await response.json();
  assertInstanceOf(json.posts, Array);
  assertEquals(typeof json.hasMore, "boolean");
});

Deno.test("GET /api/posts returns at most 10 posts per page", async () => {
  const request = new Request("http://127.0.0.1/api/posts?page=1");

  const response = await (handler as unknown as GetHandler).GET({
    req: request,
  });

  const { posts } = await response.json();
  assertEquals(posts.length <= 10, true);
});

Deno.test("GET /api/posts post items have expected shape", async () => {
  const request = new Request("http://127.0.0.1/api/posts?page=1");

  const response = await (handler as unknown as GetHandler).GET({
    req: request,
  });

  const { posts } = await response.json();
  if (posts.length > 0) {
    const post = posts[0];
    assertEquals(typeof post.slug, "string");
    assertEquals(typeof post.title, "string");
    assertEquals(typeof post.publishedAt, "string");
    assertEquals(typeof post.snippet, "string");
    // publishedAt must be a valid ISO date string
    assertEquals(isNaN(Date.parse(post.publishedAt)), false);
  }
});

Deno.test("GET /api/posts page 2 returns different posts than page 1", async () => {
  const [res1, res2] = await Promise.all([
    (handler as unknown as GetHandler).GET({
      req: new Request("http://127.0.0.1/api/posts?page=1"),
    }),
    (handler as unknown as GetHandler).GET({
      req: new Request("http://127.0.0.1/api/posts?page=2"),
    }),
  ]);

  const { posts: page1 } = await res1.json();
  const { posts: page2 } = await res2.json();

  if (page1.length > 0 && page2.length > 0) {
    assertEquals(page1[0].slug !== page2[0].slug, true);
  }
});

Deno.test("GET /api/posts out-of-range page returns empty posts and hasMore false", async () => {
  const request = new Request("http://127.0.0.1/api/posts?page=99999");

  const response = await (handler as unknown as GetHandler).GET({
    req: request,
  });

  const json = await response.json();
  assertEquals(json.posts.length, 0);
  assertEquals(json.hasMore, false);
});
