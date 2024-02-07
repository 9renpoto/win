import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { freshSEOPlugin } from "$fresh_seo";
import manifest from "./fresh.gen.ts";

export default defineConfig({
  plugins: [
    tailwind(),
    freshSEOPlugin(manifest, {
      exclude: ["/healthz"],
    }),
  ],
});
