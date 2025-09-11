import type { Post } from "@/utils/posts.ts";

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
