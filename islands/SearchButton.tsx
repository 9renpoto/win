import { Head } from "fresh/runtime";
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
    if (!ref.current) return;
    const container = ref.current;
    const run = async () => {
      if (props.docsearch) {
        props.docsearch({
          appId: "SV4Q5O4SYJ",
          apiKey: "73f700bbeef663cb76e7c4d3ca2f0fc4",
          indexName: "9renpoto.win",
          container,
        });
        return;
      }
      const mod = await import(
        "https://esm.sh/@docsearch/js@3.5.2?target=es2020"
      );
      const ds = (mod as { default?: (args: DocSearchProps) => void })
        .default as
          | ((args: DocSearchProps) => void)
          | undefined;
      (ds ?? (mod as unknown as (args: DocSearchProps) => void))({
        appId: "SV4Q5O4SYJ",
        apiKey: "73f700bbeef663cb76e7c4d3ca2f0fc4",
        indexName: "9renpoto.win",
        container,
      });
    };
    run();
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
// deno-coverage-ignore-file
