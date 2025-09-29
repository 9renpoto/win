import type { PageProps } from "$fresh/server.ts";
import { Footer } from "@/components/Footer.tsx";
import { GoogleAnalytics } from "@/components/GoogleAnalytics.tsx";
import { Header } from "@/components/Header.tsx";
import { title } from "@/utils/website.ts";

const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <GoogleAnalytics measurementId={GA4_MEASUREMENT_ID ?? undefined} />
      <body class="flex flex-col min-h-screen">
        <Header title={title} />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
