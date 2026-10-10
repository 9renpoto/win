import { marked, type Token } from "marked";
import type { Heading } from "../types.ts";

const handleDidCache = new Map<string, Promise<string | null>>();
// For test reset
export const __handleDidCache = handleDidCache;

function toXEmbed(html: string): string {
  const xStatusLinkInParagraph =
    /<p><a href="(https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/(?:(?:[A-Za-z0-9_]{1,15}\/status)|(?:i\/(?:web\/)?status))\/(\d+)(?:[/?#][^"]*)?)"[^>]*>[^<]*<\/a><\/p>/g;

  return html.replace(
    xStatusLinkInParagraph,
    (_match, _url: string, statusId: string) =>
      `<div class="x-embed"><iframe class="x-embed-frame" src="https://platform.twitter.com/embed/Tweet.html?id=${statusId}&dnt=true" loading="lazy" title="Embedded X post ${statusId}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`,
  );
}

export async function resolveDid(handle: string): Promise<string | null> {
  if (handle.startsWith("did:")) return handle;
  const cached = handleDidCache.get(handle);
  if (cached) return cached;
  const resolution = fetch(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
    { signal: AbortSignal.timeout(2000) },
  )
    .then(async (response) => {
      if (!response.ok) return null;
      const body = (await response.json()) as { did?: unknown };
      return typeof body.did === "string" && body.did.startsWith("did:")
        ? body.did
        : null;
    })
    .catch(() => null);
  handleDidCache.set(handle, resolution);
  return resolution;
}

async function toBlueskyEmbed(html: string): Promise<string> {
  // Only match Bluesky links that are the sole content of a <p>...</p> block, like X embeds
  const blueskyStatusLinkInParagraph =
    /<p><a href="(https?:\/\/(?:www\.)?bsky\.app\/profile\/([A-Za-z0-9._:-]+)\/post\/([A-Za-z0-9]+)(?:[/?#][^"]*)?)"[^>]*>[^<]*<\/a><\/p>/g;

  let rendered = html;
  const matches = Array.from(rendered.matchAll(blueskyStatusLinkInParagraph));
  for (const match of matches) {
    const [fullMatch, _url, handle, rkey] = match;
    const did = await resolveDid(handle);
    if (!did) continue;
    const embedId = `bsky-${did.replace(/[^a-zA-Z0-9_-]/g, "-")}-${rkey}`;
    const replacement = `<div class="bsky-embed"><iframe class="bsky-embed-frame" data-bsky-id="${embedId}" src="https://embed.bsky.app/embed/${did}/app.bsky.feed.post/${rkey}?id=${encodeURIComponent(
      embedId,
    )}" loading="lazy" title="Embedded Bluesky post ${rkey}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`;
    rendered = rendered.replace(fullMatch, replacement);
  }
  return rendered;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Create a custom Heading type to represent the token parameter for heading in marked
interface MarkedHeadingToken {
  type: "heading";
  raw: string;
  depth: number;
  text: string;
  tokens: Token[];
}

export async function renderMarkdown(
  content: string,
  headings: Heading[] = [],
  opts?: { skipEmbeds?: boolean },
): Promise<string> {
  const renderer = new marked.Renderer();
  renderer.heading = function (
    this: { parser: { parseInline(tokens: Token[]): string } },
    { tokens, depth, text }: MarkedHeadingToken,
  ) {
    const renderedText = this.parser.parseInline(tokens);
    const slug = slugifyHeading(text);
    headings.push({ level: depth, text: renderedText, slug });
    return `<h${depth} id="${slug}">${renderedText}</h${depth}>`;
  };

  const html = marked.parse(content, { gfm: true, renderer }) as string;
  if (opts?.skipEmbeds) return html;
  const xEmbedded = toXEmbed(html);
  return await toBlueskyEmbed(xEmbedded);
}
