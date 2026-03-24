import { useEffect, useRef } from "preact/hooks";

import * as autocompleteJs from "@algolia/autocomplete-js";
import type {
  AutocompleteApi,
  AutocompleteOptions,
} from "@algolia/autocomplete-js";
import { type LiteClient, liteClient } from "algoliasearch/lite";

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

type AutocompleteInit = (
  options: AutocompleteOptions<SearchHit>,
) => AutocompleteApi<SearchHit>;

function resolveAutocompleteInit(
  moduleLike: object,
): AutocompleteInit | undefined {
  const rootAutocomplete = Reflect.get(moduleLike, "autocomplete");
  if (typeof rootAutocomplete === "function") {
    return rootAutocomplete;
  }

  const defaultExport = Reflect.get(moduleLike, "default");
  if (defaultExport && typeof defaultExport === "object") {
    const defaultAutocomplete = Reflect.get(defaultExport, "autocomplete");
    if (typeof defaultAutocomplete === "function") {
      return defaultAutocomplete;
    }
  }

  const cjsExport = Reflect.get(moduleLike, "module.exports");
  if (cjsExport && typeof cjsExport === "object") {
    const cjsAutocomplete = Reflect.get(cjsExport, "autocomplete");
    if (typeof cjsAutocomplete === "function") {
      return cjsAutocomplete;
    }
  }

  return undefined;
}

const initAutocomplete = resolveAutocompleteInit(autocompleteJs);

// Store the active instance on window so it survives Fresh island HMR module
// re-evaluations. useRef resets to null when the module is re-evaluated, but
// window persists – letting the new effect destroy the stale instance first.
const WIN_KEY = "__algoliaAutocompleteInstance";

function getWindowInstance(): AutocompleteApi<SearchHit> | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as Record<string, unknown>)[WIN_KEY] as
    | AutocompleteApi<SearchHit>
    | undefined;
}

function setWindowInstance(inst: AutocompleteApi<SearchHit>): void {
  if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>)[WIN_KEY] = inst;
  }
}

function clearWindowInstance(): void {
  if (typeof window !== "undefined") {
    delete (window as unknown as Record<string, unknown>)[WIN_KEY];
  }
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
  const instanceRef = useRef<AutocompleteApi<SearchHit> | null>(null);

  useEffect(() => {
    if (!appId || !apiKey || !indexName || !containerRef.current) {
      return;
    }

    // Destroy any stale instance. The window reference survives Fresh island
    // HMR module re-evaluation, so the new effect can clean up what the old
    // component left behind even if the old cleanup hasn't run yet.
    const stale = getWindowInstance();
    if (stale) {
      try {
        stale.destroy();
      } catch (_) { /* ignore if already destroyed */ }
      clearWindowInstance();
    }
    instanceRef.current = null;
    containerRef.current.innerHTML = "";

    const setup = () => {
      if (!initAutocomplete) {
        throw new Error(
          "Failed to resolve autocomplete() from @algolia/autocomplete-js module",
        );
      }

      const client: LiteClient = liteClient(appId, apiKey);
      const inst = initAutocomplete({
        container: containerRef.current!,
        panelContainer: containerRef.current!,
        placeholder,
        // On viewports narrower than Tailwind's md (768 px) open as an overlay;
        // on wider viewports render inline in the header.
        detachedMediaQuery: "(max-width: 767px)",
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
                  const href = item.url ??
                    (item.slug ? `/entry/${item.slug}` : "#");
                  return html`
                    <a class="aa-ItemLink" href="${href}">
                      <div class="aa-ItemContent">
                        <div class="aa-ItemTitle">${item.title ?? item.slug ??
                          "Untitled"}</div>
                        ${item.snippet
                          ? html`
                            <div class="aa-ItemSnippet">${item.snippet}</div>
                          `
                          : ""}
                      </div>
                    </a>
                  `;
                },
              },
            },
          ];
        },
      });
      instanceRef.current = inst;
      setWindowInstance(inst);
    };

    try {
      setup();
    } catch (error) {
      console.error("AlgoliaSearch initialization failed", error);
    }

    return () => {
      // Only clean up if we are still the current owner. If a new HMR cycle
      // already ran its effect before this cleanup, it replaced the window
      // instance — destroying or clearing the DOM here would break the new one.
      const isOwner = instanceRef.current !== null &&
        getWindowInstance() === instanceRef.current;
      if (isOwner) {
        try {
          instanceRef.current!.destroy();
        } catch (_) { /* ignore */ }
        clearWindowInstance();
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      }
      instanceRef.current = null;
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
