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

export async function getPosts(): Promise<Post[]> {
  const promises: ReturnType<typeof getPost>[] = [];
  for await (const e1 of Deno.readDir(DIRECTORY)) {
    if (e1.isDirectory) {
      for await (const e2 of Deno.readDir(join(DIRECTORY, e1.name))) {
        if (e2.isDirectory) {
          for await (
            const e3 of Deno.readDir(join(DIRECTORY, e1.name, e2.name))
          ) {
            if (e3.isDirectory) {
              for await (
                const file of Deno.readDir(
                  join(DIRECTORY, e1.name, e2.name, e3.name),
                )
              ) {
                if (file.isFile && file.name.includes(".md")) {
                  const slug = file.name.replace(".md", "");
                  promises.push(getPost(join(e1.name, e2.name, e3.name, slug)));
                }
              }
            }
          }
        }
      }
    }
  }
  const posts = await Promise.all(promises);
  posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  return posts;
}

export async function getPost(slug: string): Promise<Post> {
  const text = await Deno.readTextFile(join(DIRECTORY, `${slug}.md`));
  const { attrs, body } = extract<
    Omit<Post, "published_at"> & { date: string }
  >(text);
  return {
    slug,
    title: attrs.title,
    publishedAt: new Date(attrs.date),
    content: body,
    snippet: attrs.snippet || body.slice(0, 150),
  };
}
