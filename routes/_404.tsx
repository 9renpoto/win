import { UnknownPageProps } from "fresh/compat";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <p class="max-w-screen-lg w-full px-4 pt-16 mx-auto">404 not found {url}</p>
  );
}
