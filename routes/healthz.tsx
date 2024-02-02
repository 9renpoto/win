import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getPosts, Post } from "@/utils/posts.ts";
import { description, title } from "@/utils/website.ts";
import { SEO } from "@/components/SEO.tsx";

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render(posts);
  },
};

export default function HealthPage(props: PageProps<Post[]>) {
  const posts = props.data;
  return (
    <>
      <Head>
        <SEO
          title={`health | ${title}`}
          description={description}
          keywords={["life"].join(",")}
          ogImage="https://avatars3.githubusercontent.com/u/520693?s=460&v=4"
        />
      </Head>
      <main class="flex-grow">
        This blog has {posts.length} entries.
      </main>
    </>
  );
}
