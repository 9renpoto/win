import { extract } from "@std/front-matter/any";
import { join } from "@std/path/posix";
import { marked } from "marked";

const DIRECTORY = "./posts";

export interface Heading {
  level: number;
  text: string;
  slug: string;
}

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  mtime?: Date;
  snippet: string;
  content: string;
  html: string;
  headings: Heading[];
}

const handleDidCache = new Map<string, string | null>();

function toXEmbed(html: string): string {
  const xStatusLinkInParagraph =
    /<p><a href="(https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/(?:(?:[A-Za-z0-9_]{1,15}\/status)|(?:i\/(?:web\/)?status))\/(\d+)(?:[/?#][^"]*)?)"[^>]*>[^<]*<\/a><\/p>/g;

  return html.replace(
    xStatusLinkInParagraph,
    (_match, _url: string, statusId: string) =>
      `<div class="x-embed"><iframe class="x-embed-frame" src="https://platform.twitter.com/embed/Tweet.html?id=${statusId}&dnt=true" loading="lazy" title="Embedded X post ${statusId}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`,
  );
}

async function resolveDid(handle: string): Promise<string | null> {
  if (handle.startsWith("did:")) {
    return handle;
  }

  const cached = handleDidCache.get(handle);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${
        encodeURIComponent(handle)
      }`,
    );
    if (!response.ok) {
      handleDidCache.set(handle, null);
      return null;
    }

    const body = await response.json() as { did?: string };
    const did = body.did ?? null;
    handleDidCache.set(handle, did);
    return did;
  } catch {
    handleDidCache.set(handle, null);
    return null;
  }
}

async function toBlueskyEmbed(html: string): Promise<string> {
  const blueskyLinkAnchor =
    /<a href="(https?:\/\/(?:www\.)?bsky\.app\/profile\/([A-Za-z0-9._:-]+)\/post\/([A-Za-z0-9]+)(?:[/?#][^"]*)?)"[^>]*>[^<]*<\/a>/g;

  const matches = Array.from(html.matchAll(blueskyLinkAnchor));
  if (matches.length === 0) {
    return html;
  }

  let rendered = html;
  for (const match of matches) {
    const fullMatch = match[0];
    const handle = match[2];
    const rkey = match[3];
    const did = await resolveDid(handle);
    if (!did) {
      continue;
    }

    const embedId = `bsky-${did.replace(/[^a-zA-Z0-9_-]/g, "-")}-${rkey}`;
    const replacement =
      `</p><div class="bsky-embed"><iframe class="bsky-embed-frame" data-bsky-id="${embedId}" src="https://embed.bsky.app/embed/${did}/app.bsky.feed.post/${rkey}?id=${
        encodeURIComponent(embedId)
      }" loading="lazy" title="Embedded Bluesky post ${rkey}" referrerpolicy="no-referrer-when-downgrade"></iframe></div><p>`;
    rendered = rendered.replace(fullMatch, replacement);
  }

  return rendered
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>\s*(<div class="bsky-embed">[\s\S]*?<\/div>)\s*<\/p>/g, "$1");
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function renderMarkdown(
  content: string,
  headings: Heading[] = [],
): Promise<string> {
  const renderer = new marked.Renderer();
  renderer.heading = (text: string, level: number, raw: string) => {
    const slug = slugifyHeading(raw);
    headings.push({ level, text, slug });
    return `<h${level} id="${slug}">${text}</h${level}>`;
  };

  const html = marked.parse(content, { gfm: true, renderer }) as string;
  const xEmbedded = toXEmbed(html);
  return await toBlueskyEmbed(xEmbedded);
}

export async function getPosts(): Promise<Post[]> {
  const promises: ReturnType<typeof getPost>[] = [];
  for await (const e1 of Deno.readDir(DIRECTORY)) {
    if (e1.isDirectory) {
      for await (const e2 of Deno.readDir(join(DIRECTORY, e1.name))) {
        if (e2.isDirectory) {
          for await (
            const e3 of Deno.readDir(
              join(DIRECTORY, e1.name, e2.name),
            )
          ) {
            if (e3.isDirectory) {
              for await (
                const file of Deno.readDir(
                  join(DIRECTORY, e1.name, e2.name, e3.name),
                )
              ) {
                if (file.isFile && file.name.includes(".md")) {
                  const slug = file.name.replace(".md", "");
                  promises.push(getPost(join(e1.name, e2.name, e3.name, slug)));
                }
              }
            }
          }
        }
      }
    }
  }
  const posts = await Promise.all(promises);
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return posts;
}

export async function getPost(slug: string, dir = DIRECTORY): Promise<Post> {
  const filename = join(dir, `${slug}.md`);
  const stat = await Deno.stat(filename);
  const text = await Deno.readTextFile(filename);
  const { attrs, body } = extract<
    Omit<Post, "published_at" | "headings"> & { date: string }
  >(text);

  const headings: Heading[] = [];
  const html = await renderMarkdown(body, headings);

  const publishedAt = new Date(attrs.date);
  return {
    slug,
    title: attrs.title,
    publishedAt,
    mtime: stat.mtime || undefined,
    content: body,
    html,
    snippet: attrs.snippet || body.slice(0, 150),
    headings,
  };
}
