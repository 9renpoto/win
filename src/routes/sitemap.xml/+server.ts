import { escapeXml } from "#lib/server/feed.ts";
import { posts } from "#lib/server/posts.ts";
import { siteUrl } from "#lib/website.ts";
import { SITE_URL } from "$app/env/private";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = () => {
  const origin = (SITE_URL || siteUrl).replace(/\/$/, "");
  const paths = ["/", "/about", "/graph"].map(
    (path) => `<url><loc>${escapeXml(origin + path)}</loc></url>`,
  );
  const entries = posts.map(
    (post) =>
      `<url><loc>${escapeXml(`${origin}/entry/${post.slug}`)}</loc>${post.mtime ? `<lastmod>${post.mtime}</lastmod>` : ""}</url>`,
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.join("")}${entries.join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
