import docsearch from "https://esm.sh/@docsearch/js@3.5.2?target=es2020";
import { Head } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/hooks";

// Copied from algolia source code
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
  useEffect(() => {
    if (ref.current) {
      props.docsearch ||
        docsearch({
          appId: "SV4Q5O4SYJ",
          apiKey: "73f700bbeef663cb76e7c4d3ca2f0fc4",
          indexName: "9renpoto.win",
          container: ref.current,
        });
    }
  }, [ref.current]);
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/docsearch.css" />
      </Head>
      <div
        title="Search Button"
        class={`h-9 mb-6 ${props.class ?? ""}`}
        ref={ref}
      >
      </div>
    </>
  );
}
