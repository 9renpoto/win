import { getPostPage } from "#lib/server/posts.ts";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = ({ url }) => {
  const raw = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(raw) ? Math.max(1, raw) : 1;
  return Response.json(getPostPage(page));
};
