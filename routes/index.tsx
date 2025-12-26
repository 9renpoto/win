import type { RouteHandler } from "fresh";
import { page, type PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { Bio } from "@/components/Bio.tsx";
import { SEO } from "@/components/SEO.tsx";
import { getPosts, type Post } from "@/utils/posts.ts";
import { author, description, title } from "@/utils/website.ts";

export const handler: RouteHandler<Post[], Record<string, never>> = {
  async GET(_ctx) {
    const posts = await getPosts();
    return page(posts);
  },
};

export default function BlogIndexPage({ data: posts }: PageProps<Post[]>) {
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
          {posts.map((post, i) => (
            <PostCard post={post} key={`${post.title}-${i}`} />
          ))}
        </div>
      </main>
    </>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <div class="flex-grow py-8 border-t border-gray-200">
      <a class="sm:col-span-2" href={`/entry/${post.slug}`}>
        <h3 class="text-2xl text-gray-900 font-bold">{post.title}</h3>
        <time class="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div class="mt-4 text-gray-900 overflow-hidden text-ellipsis">
          {post.snippet}
        </div>
      </a>
    </div>
  );
}
