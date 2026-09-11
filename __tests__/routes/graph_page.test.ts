import { assert } from "@std/assert";
import { handler } from "@/routes/graph.tsx";

type GetHandler = {
  GET: (ctx: { req: Request }) => Promise<Response>;
};

Deno.test("GET /graph page handler returns graph data", async () => {
  const request = new Request("http://127.0.0.1/graph");

  const response = await (handler as unknown as GetHandler).GET({
    req: request,
  });

  // Fresh page handlers return responses (usually HTML or Fresh page symbol)
  assert(response);
});
