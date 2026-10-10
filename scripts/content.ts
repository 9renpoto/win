import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { parse } from "yaml";
import { buildGraphData } from "../src/lib/content/graph.ts";
import { renderMarkdown } from "../src/lib/content/markdown.ts";
import { toSearchRecord } from "../src/lib/content/search.ts";
import type { ContentManifest, Heading, Post } from "../src/lib/types.ts";
import { siteUrl } from "../src/lib/website.ts";

export async function parsePost(
  slug: string,
  source: string,
  mtime?: string,
): Promise<Post> {
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(
    source,
  );
  if (!match) throw new Error(`Missing front matter: ${slug}`);
  const attrs: unknown = parse(match[1]);
  if (!attrs || typeof attrs !== "object")
    throw new Error(`Invalid front matter: ${slug}`);
  const metadata = attrs as Record<string, unknown>;
  if (typeof metadata.title !== "string" || !metadata.title.trim()) {
    throw new Error(`Missing title: ${slug}`);
  }
  if (typeof metadata.date !== "string")
    throw new Error(`Missing date: ${slug}`);
  const date = new Date(metadata.date);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${slug}`);
  const content = source.slice(match[0].length);
  const headings: Heading[] = [];
  const feedHtml = await renderMarkdown(content, [], { skipEmbeds: true });
  const html = await renderMarkdown(content, headings);
  const category =
    typeof metadata.category === "string"
      ? metadata.category
      : Array.isArray(metadata.categories) &&
          typeof metadata.categories[0] === "string"
        ? metadata.categories[0]
        : undefined;
  return {
    slug,
    title: metadata.title,
    publishedAt: date.toISOString(),
    ...(mtime ? { mtime } : {}),
    snippet:
      typeof metadata.snippet === "string" && metadata.snippet
        ? metadata.snippet
        : content.slice(0, 150),
    content,
    html,
    feedHtml,
    headings,
    ...(category ? { category } : {}),
  };
}

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const filename = join(directory, entry.name);
      if (entry.isDirectory()) return markdownFiles(filename);
      return Promise.resolve(
        entry.isFile() && entry.name.endsWith(".md") ? [filename] : [],
      );
    }),
  );
  return files.flat().sort();
}

export async function loadRepositoryContent(
  root: string,
): Promise<ContentManifest> {
  const directory = join(root, "posts");
  const files = await markdownFiles(directory);
  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = relative(directory, filename)
        .replaceAll("\\", "/")
        .replace(/\.md$/, "");
      if (!/^\d{4}\/\d{2}\/\d{2}\/[\w.-]+$/.test(slug))
        throw new Error(`Unexpected post path: ${slug}`);
      const [source, info] = await Promise.all([
        readFile(filename, "utf8"),
        stat(filename),
      ]);
      return parsePost(slug, source, info.mtime.toISOString());
    }),
  );
  posts.sort(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.slug.localeCompare(b.slug),
  );
  const about = await parsePost(
    "about",
    await readFile(join(root, "content", "about.md"), "utf8"),
  );
  return {
    posts,
    about,
    graph: buildGraphData(posts),
    search: posts.map((post) =>
      toSearchRecord(post, process.env.SITE_URL || siteUrl),
    ),
  };
}
