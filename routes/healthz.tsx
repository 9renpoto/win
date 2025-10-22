import { Head } from "fresh/runtime";
import { page, type PageProps } from "fresh";
import { SEO } from "@/components/SEO.tsx";
import { getPosts, type Post } from "@/utils/posts.ts";
import { description, title } from "@/utils/website.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers<Post[]> = {
  async GET(_ctx) {
    const posts = await getPosts();
    return page(posts);
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
      <main class="flex-grow">This blog has {posts.length} entries.</main>
    </>
  );
}
