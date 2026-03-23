import { useEffect } from "preact/hooks";

interface DocSearchProps {
  appId?: string;
  apiKey?: string;
  indexName?: string;
  placeholder?: string;
  containerId?: string;
}

export default function DocSearch(
  {
    appId,
    apiKey,
    indexName,
    placeholder = "Search",
    containerId = "docsearch",
  }: DocSearchProps,
) {
  useEffect(() => {
    if (!appId || !apiKey || !indexName) {
      return;
    }

    let cleanup: (() => void) | undefined;

    const setup = async () => {
      const docsearchModule = await import("@docsearch/js");
      type DocSearchInit = (options: {
        container: string;
        appId: string;
        apiKey: string;
        indices: string[];
        placeholder: string;
      }) => () => void;
      const docsearch = docsearchModule.default as unknown as DocSearchInit;

      cleanup = docsearch({
        container: `#${containerId}`,
        appId,
        apiKey,
        indices: [indexName],
        placeholder,
      });
    };

    setup();

    return () => {
      cleanup?.();
    };
  }, [apiKey, appId, containerId, indexName, placeholder]);

  if (!appId || !apiKey || !indexName) {
    return null;
  }

  return <div id={containerId} class="docsearch-root w-full md:w-auto" />;
}
