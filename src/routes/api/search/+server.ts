import { searchRecords } from "#lib/content/search.ts";
import { searchIndex } from "#lib/server/posts.ts";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = ({ url }) => {
  const hits = searchRecords(
    searchIndex,
    (url.searchParams.get("q") ?? "").slice(0, 200),
  );
  return Response.json({
    hits: hits.map(({ slug, title, publishedAt, snippet, objectID, url }) => ({
      slug,
      title,
      publishedAt,
      snippet,
      objectID,
      url,
    })),
  });
};
