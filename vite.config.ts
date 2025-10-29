import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [fresh()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    rollupOptions: {
      external: [
        "npm:marked@^12",
        "npm:github-slugger@^2.0",
        "npm:marked-alert@^2.0",
        "npm:marked-footnote@^1.2",
        "npm:marked-gfm-heading-id@^3.1",
        "npm:prismjs@^1.29",
        "npm:sanitize-html@^2.11",
        "npm:he@^1.2",
        "npm:katex@^0.16",
      ],
    },
  },
  ssr: {
    external: [
      "npm:marked@^12",
      "npm:github-slugger@^2.0",
      "npm:marked-alert@^2.0",
      "npm:marked-footnote@^1.2",
      "npm:marked-gfm-heading-id@^3.1",
      "npm:prismjs@^1.29",
      "npm:sanitize-html@^2.11",
      "npm:he@^1.2",
      "npm:katex@^0.16",
    ],
  },
});
