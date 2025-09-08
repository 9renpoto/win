import { extract } from "@std/front-matter/any";
import { join } from "@std/path/posix";
import { marked } from "marked";

const DIRECTORY = "./posts";

export interface Heading {
  level: number;
  text: string;
  slug: string;
}

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  mtime?: Date;
  snippet: string;
  content: string;
  headings: Heading[];
}

export async function getPosts(): Promise<Post[]> {
  const promises: ReturnType<typeof getPost>[] = [];
  for await (const e1 of Deno.readDir(DIRECTORY)) {
    if (e1.isDirectory) {
      for await (const e2 of Deno.readDir(join(DIRECTORY, e1.name))) {
        if (e2.isDirectory) {
          for await (
            const e3 of Deno.readDir(
              join(DIRECTORY, e1.name, e2.name),
            )
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

export async function getPost(slug: string, dir = DIRECTORY): Promise<Post> {
  const filename = join(dir, `${slug}.md`);
  const stat = await Deno.stat(filename);
  const text = await Deno.readTextFile(filename);
  const { attrs, body } = extract<
    Omit<Post, "published_at" | "headings"> & { date: string }
  >(text);

  const headings: Heading[] = [];
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const renderer = new marked.Renderer();
  renderer.heading = (text: string, level: number) => {
    const slug = slugify(text);
    headings.push({ level, text, slug });
    return `<h${level} id="${slug}">${text}</h${level}>`;
  };
  marked.use({ renderer });
  marked.parse(body);

  const publishedAt = new Date(attrs.date);
  return {
    slug,
    title: attrs.title,
    publishedAt,
    mtime: stat.mtime || undefined,
    content: body,
    snippet: attrs.snippet || body.slice(0, 150),
    headings,
  };
}
