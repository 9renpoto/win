import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { freshSEOPlugin } from "$fresh_seo";
import manifest from "./fresh.gen.ts";
import { getPosts } from "./utils/posts.ts";
import * as Sentry from "@sentry/deno";

const dsn = Deno.env.get("SENTRY_DSN");

if (dsn) {
  Sentry.init({
    dsn,
    sampleRate: 1.0,
    tracesSampleRate: 1.0,
  });
} else {
  console.warn("SENTRY_DSN environment not set");
}

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
