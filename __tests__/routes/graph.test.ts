import { assertEquals, assertInstanceOf } from "@std/assert";
import { handler } from "@/routes/api/graph.ts";

type GetHandler = {
  GET: (ctx: { req: Request }) => Promise<Response>;
};

Deno.test("GET /api/graph returns nodes and edges", async () => {
  const request = new Request("http://127.0.0.1/api/graph");

  const response = await (handler as unknown as GetHandler).GET({
    req: request,
  });

  assertEquals(response.status, 200);
  assertEquals(response.headers.get("Content-Type"), "application/json");

  const json = await response.json();
  assertInstanceOf(json.nodes, Array);
  assertInstanceOf(json.edges, Array);
  assertEquals(json.nodes.length > 0, true);
  assertEquals(json.edges.length > 0, true);

  const firstNode = json.nodes[0];
  assertEquals(typeof firstNode.id, "string");
  assertEquals(typeof firstNode.title, "string");
  assertEquals(typeof firstNode.path, "string");
  assertEquals(typeof firstNode.linkCount, "number");

  const firstEdge = json.edges[0];
  assertEquals(typeof firstEdge.source, "string");
  assertEquals(typeof firstEdge.target, "string");
});
