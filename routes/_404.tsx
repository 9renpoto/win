import type { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <p class="max-w-screen-lg w-full px-4 pt-16 mx-auto">404 Not found {url}</p>
  );
}
