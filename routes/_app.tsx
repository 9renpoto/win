import { Head } from "$fresh/runtime.ts";
import { AppProps, Handlers } from "$fresh/src/server/types.ts";
import { createReporter } from "https://deno.land/x/g_a@0.1.2/mod.ts";

const ga = createReporter({ id: "G-5SVZ0B41GD" });

const handler: Handlers = {
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
        <title>:-) 🏕</title>
      </Head>
      <body>
        <Component />
      </body>
    </html>
  );
}
