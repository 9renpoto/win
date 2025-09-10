import { Head } from "$fresh/runtime.ts";
import { useRef } from "preact/hooks";

type DocSearchProps = {
  appId: string;
  apiKey: string;
  indexName: string;
  container: HTMLElement | string;
};

export default function SearchButton(props: {
  docsearch?: (args: DocSearchProps) => void;
  class?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Test stub: no side effects, just render a container
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/docsearch.css" />
      </Head>
      <div
        title="Search Button"
        class={`h-9 mb-6 ${props.class ?? ""}`}
        ref={ref}
      />
    </>
  );
}

