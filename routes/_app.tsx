import { AppProps, Handlers } from "$fresh/src/server/types.ts";
import { createReporter } from "$g_a";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";

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
      <body>
        <Header />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
