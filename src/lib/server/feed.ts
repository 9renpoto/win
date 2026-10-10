import type { Post } from "../types.ts";
import { author, title } from "../website.ts";

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function cdata(value: string): string {
  return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

export function renderRss(posts: Post[], domain: string): string {
  return `<rss xmlns:blogChannel="${escapeXml(domain)}" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0"><channel>
    <title>${escapeXml(title)}</title><link>${escapeXml(domain)}</link><description>${escapeXml(title)}</description><language>ja</language><ttl>40</ttl>
    ${posts
      .map(
        (post) => `<item>
      <title><![CDATA[${cdata(post.title)}]]></title>
      <description><![CDATA[${escapeXml(post.snippet)}]]></description>
      <content:encoded><![CDATA[${cdata(post.feedHtml)}]]></content:encoded>
      <author><![CDATA[${cdata(author)}]]></author>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <link>${escapeXml(domain)}/entry/${post.slug}</link><guid>${escapeXml(domain)}/entry/${post.slug}</guid>
    </item>`,
      )
      .join("")}
  </channel></rss>`;
}
