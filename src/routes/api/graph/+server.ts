import { graph } from "#lib/server/posts.ts";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = () => Response.json(graph);
