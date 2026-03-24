import { useEffect, useRef } from "preact/hooks";

import type { AutocompleteApi } from "@algolia/autocomplete-js";
import type { LiteClient } from "algoliasearch/lite";

interface AlgoliaSearchProps {
  appId?: string;
  apiKey?: string;
  indexName?: string;
  placeholder?: string;
  containerId?: string;
}

interface SearchHit {
  objectID: string;
  title?: string;
  snippet?: string;
  url?: string;
  slug?: string;
  [key: string]: unknown;
}

export default function AlgoliaSearch(
  {
    appId,
    apiKey,
    indexName,
    placeholder = "Search",
    containerId = "algolia-search",
  }: AlgoliaSearchProps,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!appId || !apiKey || !indexName || !containerRef.current) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const setup = async () => {
      const [{ liteClient: createClient }, { autocomplete }] = await Promise.all([
        import("algoliasearch/lite"),
        import("@algolia/autocomplete-js"),
      ]);

      if (disposed || !containerRef.current) {
        return;
      }

      const client: LiteClient = createClient(appId, apiKey);
      const autocompleteApi: AutocompleteApi<SearchHit> = autocomplete({
        container: containerRef.current,
        placeholder,
        detachedMediaQuery: "none",
        openOnFocus: true,
        panelPlacement: "input-wrapper-width",
        getSources({ query }) {
          const trimmed = query.trim();
          if (trimmed.length === 0) {
            return [];
          }

          return [
            {
              sourceId: "posts",
              async getItems() {
                const result = await client.searchForHits<SearchHit>({
                  requests: [{ indexName, query: trimmed, hitsPerPage: 8 }],
                });
                return result.results[0]?.hits ?? [];
              },
              getItemUrl({ item }) {
                return item.url ?? (item.slug ? `/entry/${item.slug}` : "#");
              },
              templates: {
                item({ item, html }) {
                  const href = item.url ?? (item.slug ? `/entry/${item.slug}` : "#");
                  return html`
                    <a class="aa-ItemLink" href="${href}">
                      <div class="aa-ItemContent">
                        <div class="aa-ItemTitle">${item.title ?? item.slug ?? "Untitled"}</div>
                        ${item.snippet ? html`<div class="aa-ItemSnippet">${item.snippet}</div>` : ""}
                      </div>
                    </a>
                  `;
                },
              },
            },
          ];
        },
      });

      cleanup = () => {
        autocompleteApi.destroy();
      };
    };

    setup().catch(() => {
      // Keep search UI hidden on runtime import/init failure.
    });

    return () => {
      disposed = true;
      cleanup?.();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [apiKey, appId, indexName, placeholder]);

  if (!appId || !apiKey || !indexName) {
    return null;
  }

  return (
    <div id={containerId} class="algolia-search-root w-full md:w-auto">
      <div ref={containerRef} class="algolia-search-box" />
    </div>
  );
}
