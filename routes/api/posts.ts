import type { RouteHandler } from "fresh";
import { getPosts } from "@/utils/posts.ts";

const PAGE_SIZE = 10;

export const handler: RouteHandler<Response, Record<string, never>> = {
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const offset = (page - 1) * PAGE_SIZE;

    const all = await getPosts();
    const posts = all.slice(offset, offset + PAGE_SIZE).map((p) => ({
      slug: p.slug,
      title: p.title,
      publishedAt: p.publishedAt.toISOString(),
      snippet: p.snippet,
    }));
    const hasMore = offset + PAGE_SIZE < all.length;

    return new Response(JSON.stringify({ posts, hasMore }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
