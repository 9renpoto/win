import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type Plugin } from "vite";
import { generateContent } from "./scripts/generate-content.ts";

function contentWatch(): Plugin {
  return {
    name: "blog-content-watch",
    configureServer(server) {
      server.watcher.add(["posts", "content"]);
      let pending = Promise.resolve();
      const update = (filename: string) => {
        const path = filename.replaceAll("\\", "/");
        if (!path.endsWith(".md") || !/\/(posts|content)\//.test(path)) return;
        pending = pending
          .then(() => generateContent())
          .catch((error: unknown) => {
            server.config.logger.error(String(error));
          });
      };
      server.watcher
        .on("change", update)
        .on("add", update)
        .on("unlink", update);
      server.httpServer?.once("close", () => {
        server.watcher
          .off("change", update)
          .off("add", update)
          .off("unlink", update);
      });
    },
  };
}

export default defineConfig({
  plugins: [sveltekit({ adapter: adapter() }), contentWatch()],
});
