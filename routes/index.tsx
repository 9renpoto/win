import type { RouteHandler } from "fresh";
import { page, type PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { Bio } from "@/components/Bio.tsx";
import { SEO } from "@/components/SEO.tsx";
import PostList, { type PostItem } from "@/islands/PostList.tsx";
import { getPosts } from "@/utils/posts.ts";
import { author, description, title } from "@/utils/website.ts";

const PAGE_SIZE = 10;

interface IndexData {
  posts: PostItem[];
  hasMore: boolean;
}

export const handler: RouteHandler<IndexData, Record<string, never>> = {
  async GET(_ctx) {
    const all = await getPosts();
    const posts = all.slice(0, PAGE_SIZE).map((p) => ({
      slug: p.slug,
      title: p.title,
      publishedAt: p.publishedAt.toISOString(),
      snippet: p.snippet,
    }));
    return page({ posts, hasMore: all.length > PAGE_SIZE });
  },
};

export default function BlogIndexPage(
  { data: { posts, hasMore } }: PageProps<IndexData>,
) {
  return (
    <>
      <Head>
        <SEO
          title={title}
          description={description}
          keywords={["life"].join(",")}
          ogImage="https://avatars3.githubusercontent.com/u/520693?s=460&v=4"
        />
      </Head>
      <main class="max-w-screen-lg w-full px-4 pt-4 mx-auto">
        <Bio author={author} />
        <div class="mt-8">
          <PostList initialPosts={posts} initialHasMore={hasMore} />
        </div>
      </main>
    </>
  );
}
