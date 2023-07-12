import { AppProps } from "$fresh/server.ts";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import { title } from "@/utils/website.ts";

export default function App({ Component }: AppProps) {
  return (
    <html lang="ja">
      <body class="flex flex-col min-h-screen">
        <Header title={title} />
        <Component />
        <Footer />
      </body>
    </html>
  );
}
