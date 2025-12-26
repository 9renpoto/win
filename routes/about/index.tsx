import { CSS, render } from "@deno/gfm";
import type { RouteHandler } from "fresh";
import { page, type PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { SEO } from "@/components/SEO.tsx";
import { getPost, type Post } from "@/utils/posts.ts";
import { description, title } from "@/utils/website.ts";

export const handler: RouteHandler<Post, Record<string, never>> = {
  async GET(_ctx) {
    const post = await getPost("about", "./routes/about");
    return page(post as Post);
  },
};

export default function AboutPage(props: PageProps<Post>) {
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
      <main class="flex-grow max-w-screen-lg w-full px-4 pt-4 mx-auto">
        <h1 class="text-2xl font-bold">{post.title}</h1>
        <time class="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div
          class="mt-8 markdown-body"
          dangerouslySetInnerHTML={{ __html: render(post.content) }}
        />
      </main>
    </>
  );
}
