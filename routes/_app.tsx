import type { PageProps } from "fresh";
import { Footer } from "@/components/Footer.tsx";
import { GoogleAnalytics } from "@/components/GoogleAnalytics.tsx";
import { Header } from "@/components/Header.tsx";
import { title } from "@/utils/website.ts";

const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");
const DOCSEARCH_APP_ID = Deno.env.get("DOCSEARCH_APP_ID");
const DOCSEARCH_API_KEY = Deno.env.get("DOCSEARCH_API_KEY");
const DOCSEARCH_INDEX_NAME = Deno.env.get("DOCSEARCH_INDEX_NAME");

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <GoogleAnalytics measurementId={GA4_MEASUREMENT_ID ?? undefined} />
      <body class="flex flex-col min-h-screen">
        <Header
          title={title}
          docSearchAppId={DOCSEARCH_APP_ID ?? undefined}
          docSearchApiKey={DOCSEARCH_API_KEY ?? undefined}
          docSearchIndexName={DOCSEARCH_INDEX_NAME ?? undefined}
        />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
