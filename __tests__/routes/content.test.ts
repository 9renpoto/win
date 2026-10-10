import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { graph, posts } from "../../src/lib/server/posts.ts";
import { GET as getGraph } from "../../src/routes/api/graph/+server.ts";
import { GET as getPosts } from "../../src/routes/api/posts/+server.ts";
import { GET as search } from "../../src/routes/api/search/+server.ts";

const event = <T>(path: string): T =>
  ({ url: new URL(path, "http://localhost") }) as T;
describe("content endpoints", () => {
  it("keeps pagination fields and all source posts without duplicates", async () => {
    const slugs: string[] = [];
    for (let page = 1; page <= Math.ceil(posts.length / 10); page++) {
      const response = await getPosts(event(`/api/posts?page=${page}`));
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.ok(body.posts.length <= 10);
      assert.equal(body.hasMore, page * 10 < posts.length);
      for (const item of body.posts) {
        assert.deepEqual(Object.keys(item).sort(), [
          "publishedAt",
          "slug",
          "snippet",
          "title",
        ]);
        assert.equal(
          new Date(item.publishedAt).toISOString(),
          item.publishedAt,
        );
        slugs.push(item.slug);
      }
    }
    assert.deepEqual(
      slugs,
      posts.map((post) => post.slug),
    );
    assert.equal(new Set(slugs).size, posts.length);
  });
  it("returns an empty final page and normalizes invalid input", async () => {
    assert.deepEqual(
      await (await getPosts(event("/api/posts?page=9999"))).json(),
      { posts: [], hasMore: false },
    );
    for (const page of ["bad", "0", "-1"]) {
      const result = await (
        await getPosts(event(`/api/posts?page=${page}`))
      ).json();
      assert.equal(result.posts[0].slug, posts[0].slug);
    }
  });
  it("returns the shared article graph with valid endpoints", async () => {
    const response = await getGraph(event("/api/graph"));
    assert.deepEqual(await response.json(), graph);
    assert.deepEqual(
      graph.nodes.map((node) => node.id),
      posts.map((post) => post.slug),
    );
    assert.ok(graph.edges.length > 0);
    const ids = new Set(graph.nodes.map((node) => node.id));
    for (const edge of graph.edges) {
      assert.equal(ids.has(edge.source), true);
      assert.equal(ids.has(edge.target), true);
    }
  });
  it("searches local content with no external credentials", async () => {
    const result = await (await search(event("/api/search?q=neovim"))).json();
    assert.equal(
      result.hits.some(
        (hit: { slug: string }) => hit.slug === "2016/12/17/first-nvim",
      ),
      true,
    );
    assert.ok(result.hits.length <= 8);
    for (const hit of result.hits) {
      assert.equal(hit.url, `/entry/${hit.slug}`);
      assert.equal(hit.content, undefined);
    }
    assert.deepEqual(await (await search(event("/api/search?q="))).json(), {
      hits: [],
    });
  });
});
