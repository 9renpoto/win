import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { freshSEOPlugin } from "$fresh_seo";
import manifest from "./fresh.gen.ts";
import { getPosts } from "./utils/posts.ts";

const posts = await getPosts();

export default defineConfig({
  plugins: [
    tailwind(),
    freshSEOPlugin(manifest, {
      include: posts.map(({ mtime, slug }) => ({
        path: `/entry/${slug}`,
        options: { lastmod: mtime },
      })),
      exclude: ["/healthz"],
    }),
  ],
});
