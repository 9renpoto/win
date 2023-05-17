import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return <p class="max-w-screen-md w-full px-4 pt-16 mx-auto">404 not found</p>;
}
