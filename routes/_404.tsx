import type { PageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: PageProps) {
  return (
    <p class="max-w-screen-md w-full px-4 pt-16 mx-auto">404 not found {url}</p>
  );
}
