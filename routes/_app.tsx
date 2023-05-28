import { AppProps, Handlers } from "$fresh/src/server/types.ts";
import { createReporter } from "$g_a";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import { description, title } from "@/utils/website.ts";
import { Head } from "$fresh/runtime.ts";
import { SEO } from "@/components/SEO.tsx";

const ga = createReporter({ id: "G-5SVZ0B41GD" });

export const handler: Handlers = {
  async GET(req, ctx) {
    let err;
    const start = performance.now();
    const res = await ctx.render();
    ga(req, ctx, res!, start, err);
    return res;
  },
};

export default function App({ Component }: AppProps) {
  return (
    <html lang="ja">
      <Head>
        <SEO
          title={title}
          description={description}
          keywords={["life"].join(",")}
          ogImage="https://avatars3.githubusercontent.com/u/520693?s=460&v=4"
        />
      </Head>
      <body class="flex flex-col min-h-screen">
        <Header title={title} />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
