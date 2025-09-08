import { Head } from "$fresh/runtime.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import { TableOfContents } from "@/components/TableOfContents.tsx";
import { SEO } from "@/components/SEO.tsx";
import LikeButton from "@/islands/LikeButton.tsx";
import { getPost, type Post } from "@/utils/posts.ts";
import { description, title } from "@/utils/website.ts";
import { CSS, render } from "@deno/gfm";

import "https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check";

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    const post = await getPost(ctx.params.all);
    return ctx.render(post as Post);
  },
};

export default function PostPage(props: PageProps<Post>) {
  const post = props.data;
  return (
    <>
      <Head>
        <SEO
          title={`${post.title} | ${title}`}
          description={description}
          keywords={["life"].join(",")}
          ogImage="https://avatars3.githubusercontent.com/u/520693?s=460&v=4"
        />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <div class="flex-grow max-w-screen-lg mx-auto w-full px-4 pt-4">
        <div class="flex flex-row">
          <div class="hidden md:block w-20">
            <div class="sticky top-20">
              <LikeButton slug={post.slug} />
            </div>
          </div>
          <main class="w-full lg:w-3/4">
            <h1 class="text-2xl font-bold">{post.title}</h1>
            <div class="grid grid-cols-2 gap-4">
              <time class="text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <p class="text-gray-500">Number of word {post.content.length}</p>
            </div>
            <div
              class="mt-8 markdown-body"
              dangerouslySetInnerHTML={{ __html: render(post.content) }}
            />
          </main>
          <aside class="hidden lg:block w-1/4 pl-8">
            <div class="sticky top-20">
              <TableOfContents headings={post.headings} />
            </div>
          </aside>
        </div>
      </div>
      <div class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-center">
        <LikeButton slug={post.slug} variant="footer" />
      </div>
    </>
  );
}
