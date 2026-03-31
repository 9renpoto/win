import type { PageProps } from "fresh";
import { Footer } from "@/components/Footer.tsx";
import { GoogleAnalytics } from "@/components/GoogleAnalytics.tsx";
import { Header } from "@/components/Header.tsx";
import { title } from "@/utils/website.ts";

const GA4_MEASUREMENT_ID = Deno.env.get("GA4_MEASUREMENT_ID");
const ALGOLIA_APP_ID = Deno.env.get("ALGOLIA_APP_ID");
const ALGOLIA_SEARCH_API_KEY = Deno.env.get("ALGOLIA_SEARCH_API_KEY");
const ALGOLIA_INDEX_NAME = Deno.env.get("ALGOLIA_INDEX_NAME");
const socialEmbedResizeScript = `
window.addEventListener("message", (event) => {
  const data = event.data;

  if (event.origin === "https://embed.bsky.app") {
    if (!data || typeof data.id !== "string" || typeof data.height !== "number") return;
    const frames = document.querySelectorAll('iframe[data-bsky-id]');
    for (const frame of frames) {
      if (
        frame.dataset &&
        frame.dataset.bskyId === data.id &&
        frame.contentWindow === event.source
      ) {
        frame.style.height = data.height + "px";
        break;
      }
    }
    return;
  }

  if (
    event.origin !== "https://platform.twitter.com" &&
    event.origin !== "https://syndication.twitter.com"
  ) {
    return;
  }

  let height = null;
  if (data && typeof data === "object" && typeof data.height === "number") {
    height = data.height;
  } else if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed.height === "number") {
        height = parsed.height;
      }
    } catch {
      // Ignore non-JSON messages.
    }
  }

  if (!height || !event.source) return;

  const frames = document.querySelectorAll("iframe.x-embed-frame");
  for (const frame of frames) {
    if (frame.contentWindow === event.source) {
      frame.style.height = Math.max(360, Math.ceil(height) + 16) + "px";
      break;
    }
  }
});
`;

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <GoogleAnalytics measurementId={GA4_MEASUREMENT_ID ?? undefined} />
      <body class="flex flex-col min-h-screen">
        <Header
          title={title}
          algoliaAppId={ALGOLIA_APP_ID ?? undefined}
          algoliaSearchApiKey={ALGOLIA_SEARCH_API_KEY ?? undefined}
          algoliaIndexName={ALGOLIA_INDEX_NAME ?? undefined}
        />
        <Component />
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: socialEmbedResizeScript }} />
      </body>
    </html>
  );
}
