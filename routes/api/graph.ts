import type { RouteHandler } from "fresh";
import { getGraphData } from "@/utils/graph.ts";

export const handler: RouteHandler<Response, Record<string, never>> = {
  async GET(_ctx) {
    const data = await getGraphData();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
