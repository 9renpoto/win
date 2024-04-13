import { Head } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/hooks";
import docsearch from "https://esm.sh/@docsearch/js@3.5.2?target=es2020";

// Copied from algolia source code
type DocSearchProps = {
  appId: string;
  apiKey: string;
  indexName: string;
  container: HTMLElement | string;
};

export default function SearchButton(
  props: { docsearch?: (args: DocSearchProps) => void; class?: string },
) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      props.docsearch || docsearch({
        appId: process.env["ALGOLIA_APP_ID"],
        apiKey: process.env["ALGOLIA_API_KEY"],
        indexName: process.env["ALGOLIA_INDEX_NAME"],
        container: ref.current,
      });
    }
  }, [ref.current]);
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="/docsearch.css"
        />
      </Head>
      <div
        title="Search Button"
        class={"h-9 mb-6 " + (props.class ?? "")}
        ref={ref}
      >
      </div>
    </>
  );
}
