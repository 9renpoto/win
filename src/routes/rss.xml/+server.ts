import { getDomainUrl } from "#lib/net.ts";
import { renderRss } from "#lib/server/feed.ts";
import { posts } from "#lib/server/posts.ts";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = ({ request }) =>
  new Response(renderRss(posts, getDomainUrl(request)), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=600, s-maxage=86400",
    },
  });
