import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getPost, Post } from "@/utils/posts.ts";
import { CSS, render } from "$gfm";
import { description, title } from "@/utils/website.ts";
import { SEO } from "@/components/SEO.tsx";

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
      <main class="flex-grow max-w-screen-md w-full px-4 pt-4 mx-auto">
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
    </>
  );
}
