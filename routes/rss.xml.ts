import type { RouteHandler } from "fresh";
import { getDomainUrl } from "@/utils/net.ts";
import { getPosts } from "@/utils/posts.ts";
import { author, title } from "@/utils/website.ts";

function escapeCdata(value: string) {
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

function escapeHtml(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const handler: RouteHandler<Response, Record<string, never>> = {
  async GET(ctx) {
    const domainUrl = getDomainUrl(ctx.req);

    const allPosts = await getPosts();

    const rssString = `
    <rss xmlns:blogChannel="${domainUrl}" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
    <channel>
      <title>${title}</title>
      <link>${domainUrl}</link>
      <description>${title}</description>
      <language>ja</language>
      <ttl>40</ttl>
      ${
      allPosts
        .map(({ slug, publishedAt, snippet, title: postTitle, html }) =>
          `
          <item>
            <title><![CDATA[${escapeCdata(postTitle)}]]></title>
            <description><![CDATA[${escapeHtml(snippet)}]]></description>
            <content:encoded><![CDATA[${escapeCdata(html)}]]></content:encoded>
            <author><![CDATA[${escapeCdata(author)}]]></author>
            <pubDate>${publishedAt.toUTCString()}</pubDate>
            <link>${domainUrl}/entry/${slug}</link>
            <guid>${domainUrl}/entry/${slug}</guid>
          </item>
        `.trim()
        )
        .join("")
    }
    </channel>
    </rss>`.trim();

    const headers = new Headers({
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
    });

    return new Response(rssString, { headers });
  },
};
