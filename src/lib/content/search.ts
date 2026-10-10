import type { Post, SearchRecord } from "../types.ts";

export function markdownToText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function toSearchRecord(post: Post, baseUrl: string): SearchRecord {
  return {
    objectID: post.slug,
    slug: post.slug,
    url: `${baseUrl.replace(/\/$/, "")}/entry/${post.slug}`,
    title: post.title,
    snippet: post.snippet,
    content: markdownToText(post.content).slice(0, 4000),
    publishedAt: post.publishedAt,
    ...(post.mtime ? { mtime: post.mtime } : {}),
  };
}

export function searchRecords(
  records: SearchRecord[],
  query: string,
): SearchRecord[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return records
    .map((record) => {
      const title = record.title.toLocaleLowerCase();
      const haystack =
        `${title} ${record.slug} ${record.snippet} ${record.content}`.toLocaleLowerCase();
      const matches = terms.every((term) => haystack.includes(term));
      const score = terms.reduce(
        (sum, term) => sum + (title.includes(term) ? 2 : 0),
        0,
      );
      return { record, matches, score };
    })
    .filter((entry) => entry.matches)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.record.publishedAt.localeCompare(a.record.publishedAt),
    )
    .slice(0, 8)
    .map(({ record }) => ({ ...record, url: `/entry/${record.slug}` }));
}
