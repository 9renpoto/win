import type { ContentManifest, PostItem } from "../types.ts";
import manifest from "./generated/content.json" with { type: "json" };

const content: ContentManifest = manifest;
export const posts = content.posts;
export const about = content.about;
export const graph = content.graph;
export const searchIndex = content.search;
const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
export const getPost = (slug: string) => postsBySlug.get(slug);

export function getPostPage(page = 1): { posts: PostItem[]; hasMore: boolean } {
  const offset = (page - 1) * 10;
  return {
    posts: posts
      .slice(offset, offset + 10)
      .map(({ slug, title, publishedAt, snippet }) => ({
        slug,
        title,
        publishedAt,
        snippet,
      })),
    hasMore: offset + 10 < posts.length,
  };
}
