import { extract } from "$std/encoding/front_matter.ts";
import { join } from "$std/path/posix.ts";

const DIRECTORY = "./posts";

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  snippet: string;
  content: string;
}

// Get posts.
export async function getPosts(): Promise<Post[]> {
  const files = Deno.readDir(DIRECTORY);
  const promises: ReturnType<typeof getPost>[] = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getPost(slug));
  }
  const posts = await Promise.all(promises);
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return posts;
}

// Get post.
export async function getPost(slug: string): Promise<Post> {
  const text = await Deno.readTextFile(join(DIRECTORY, `${slug}.md`));
  const { attrs, body } = extract<
    Omit<Post, "publishedAt"> & { published_at: string }
  >(text);
  return {
    slug,
    title: attrs.title,
    publishedAt: new Date(attrs.published_at),
    content: body,
    snippet: attrs.snippet,
  };
}
