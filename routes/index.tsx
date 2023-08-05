import { Handlers, PageProps } from "$fresh/server.ts";
import { getPosts, type Post } from "@/utils/posts.ts";
import { Bio } from "@/components/Bio.tsx";
import { author } from "@/utils/website.ts";

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render(posts);
  },
};

export default function BlogIndexPage({ data: posts }: PageProps<Post[]>) {
  return (
    <main class="max-w-screen-lg w-full px-4 pt-4 mx-auto">
      <Bio author={author} />
      <div class="mt-8">
        {posts.map((post) => <PostCard post={post} />)}
      </div>
    </main>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <div class="flex-grow py-8 border(t gray-200)">
      <a class="sm:col-span-2" href={`/entry/${post.slug}`}>
        <h3 class="text(2xl gray-900) font-bold">
          {post.title}
        </h3>
        <time class="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div class="mt-4 text-gray-900">
          {post.snippet}
        </div>
      </a>
    </div>
  );
}
