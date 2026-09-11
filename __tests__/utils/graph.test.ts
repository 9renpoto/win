import { assert, assertEquals } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";
import {
  __resetGraphCache,
  buildGraphData,
  extractInternalLinks,
  getGraphData,
} from "@/utils/graph.ts";
import type { Post } from "@/utils/posts.ts";

describe("graph utility", () => {
  beforeEach(() => {
    __resetGraphCache();
  });

  describe("extractInternalLinks", () => {
    const validSlugs = new Set(["2020/01/01/post-a", "2020/01/02/post-b"]);

    it("extracts relative /entry/... links", () => {
      const content =
        `Check out [Post A](/entry/2020/01/01/post-a/) and [Post B](/entry/2020/01/02/post-b).`;
      const links = extractInternalLinks(
        content,
        "2020/01/03/post-c",
        validSlugs,
      );
      assertEquals(links.sort(), [
        "2020/01/01/post-a",
        "2020/01/02/post-b",
      ]);
    });

    it("extracts full URL links to entry", () => {
      const content =
        `See [Post A](https://9renpoto.win/entry/2020/01/01/post-a).`;
      const links = extractInternalLinks(
        content,
        "2020/01/03/post-c",
        validSlugs,
      );
      assertEquals(links, ["2020/01/01/post-a"]);
    });

    it("ignores self-links and non-existent slugs", () => {
      const content =
        `Link to self: /entry/2020/01/01/post-a and non-existent /entry/9999/99/99/unknown`;
      const links = extractInternalLinks(
        content,
        "2020/01/01/post-a",
        validSlugs,
      );
      assertEquals(links, []);
    });

    it("deduplicates multiple links to same target", () => {
      const content =
        `Mention 1: /entry/2020/01/01/post-a. Mention 2: /entry/2020/01/01/post-a/`;
      const links = extractInternalLinks(
        content,
        "2020/01/02/post-b",
        validSlugs,
      );
      assertEquals(links, ["2020/01/01/post-a"]);
    });
  });

  describe("buildGraphData", () => {
    const mockPosts: Post[] = [
      {
        slug: "2020/01/01/a",
        title: "Article A",
        publishedAt: new Date("2020-01-01T00:00:00Z"),
        snippet: "snippet a",
        content: "Links to [B](/entry/2020/01/02/b)",
        html: "<p>Links to B</p>",
        headings: [],
        category: "dev",
      },
      {
        slug: "2020/01/02/b",
        title: "Article B",
        publishedAt: new Date("2020-01-02T00:00:00Z"),
        snippet: "snippet b",
        content:
          "Links to [A](/entry/2020/01/01/a) and [C](/entry/2020/01/03/c)",
        html: "<p>Links</p>",
        headings: [],
      },
      {
        slug: "2020/01/03/c",
        title: "Article C",
        publishedAt: new Date("2020-01-03T00:00:00Z"),
        snippet: "snippet c",
        content: "No links here",
        html: "<p>No links</p>",
        headings: [],
      },
    ];

    it("builds nodes and edges correctly with linkCount", () => {
      const data = buildGraphData(mockPosts);

      assertEquals(data.nodes.length, 3);
      const nodeA = data.nodes.find((n) => n.id === "2020/01/01/a")!;
      const nodeB = data.nodes.find((n) => n.id === "2020/01/02/b")!;
      const nodeC = data.nodes.find((n) => n.id === "2020/01/03/c")!;

      assertEquals(nodeA.title, "Article A");
      assertEquals(nodeA.path, "/entry/2020/01/01/a");
      assertEquals(nodeA.category, "dev");
      // A links to B (1), B links to A (1) -> linkCount for A is 2
      assertEquals(nodeA.linkCount, 2);
      // B links to A, B links to C, A links to B -> linkCount for B is 3
      assertEquals(nodeB.linkCount, 3);
      // B links to C -> linkCount for C is 1
      assertEquals(nodeC.linkCount, 1);

      assertEquals(data.edges.length, 3);
      assertEquals(data.edges, [
        { source: "2020/01/01/a", target: "2020/01/02/b" },
        { source: "2020/01/02/b", target: "2020/01/01/a" },
        { source: "2020/01/02/b", target: "2020/01/03/c" },
      ]);
    });
  });

  describe("getGraphData", () => {
    it("returns graph data with nodes and edges from actual posts", async () => {
      const data = await getGraphData();
      assert(data.nodes.length > 0);
      assert(data.edges.length > 0);

      // Verify node format
      const first = data.nodes[0];
      assert(typeof first.id === "string");
      assert(typeof first.title === "string");
      assert(typeof first.path === "string");
      assert(typeof first.linkCount === "number");

      // Verify edge endpoints exist in nodes
      const nodeIds = new Set(data.nodes.map((n) => n.id));
      for (const edge of data.edges) {
        assert(nodeIds.has(edge.source));
        assert(nodeIds.has(edge.target));
      }
    });

    it("caches graph data on consecutive calls", async () => {
      const data1 = await getGraphData();
      const data2 = await getGraphData();
      assertEquals(data1, data2);
    });
  });
});
