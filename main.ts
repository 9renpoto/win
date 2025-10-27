import "@/utils/window-polyfill.ts";
import { App, staticFiles } from "fresh";
import { freshSEOPlugin } from "$fresh_seo";
import { getPosts } from "./utils/posts.ts";
import { walk } from "jsr:@std/fs@^1.0.0/walk";
import { join, relative } from "@std/path";

export const app = new App();

app.use(staticFiles());

const manifest = await buildManifest();
const posts = await getPosts();

const seoPlugin = freshSEOPlugin(manifest, {
  include: posts.map(({ mtime, slug }) => ({
    path: `/entry/${slug}`,
    options: { lastmod: mtime },
  })),
  exclude: ["/healthz"],
});

for (const route of seoPlugin.routes) {
  app.get(route.path, (ctx) => route.handler(ctx.req));
}

app.fsRoutes();

interface FreshManifest {
  routes: Record<string, unknown>;
  islands: Record<string, unknown>;
  baseUrl: string;
}

async function buildManifest(): Promise<FreshManifest> {
  const routesDir = join(Deno.cwd(), "routes");
  const routes: Record<string, unknown> = {};

  for await (
    const entry of walk(routesDir, {
      includeDirs: false,
      exts: [".ts", ".tsx"],
    })
  ) {
    if (!entry.isFile) continue;
    const relativePath = relative(routesDir, entry.path).replaceAll("\\", "/");
    routes[`./routes/${relativePath}`] = {};
  }

  return {
    routes,
    islands: {},
    baseUrl: "",
  };
}
