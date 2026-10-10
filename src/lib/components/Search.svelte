<script lang="ts">
  import { liteClient } from "algoliasearch/lite";
  import { onMount } from "svelte";
  import type { SearchConfig } from "#lib/types.ts";
  import { afterNavigate, goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  interface SearchHit {
    objectID: string;
    slug?: string;
    title?: string;
    snippet?: string;
    url?: string;
  }
  let { config }: { config: SearchConfig | null } = $props();
  let query = $state("");
  let ready = $state(false);
  let hits = $state<SearchHit[]>([]);
  let loading = $state(false);
  let error = $state("");
  let open = $state(false);
  let active = $state(-1);
  let root: HTMLDivElement;
  const client = $derived(
    config ? liteClient(config.appId, config.apiKey) : null,
  );

  function hitSlug(hit: SearchHit): string {
    if (hit.slug && /^\d{4}\/\d{2}\/\d{2}\/[\w.-]+$/.test(hit.slug))
      return hit.slug;
    try {
      const url = new URL(hit.url ?? "", "https://9renpoto.win");
      return /^\/entry\/\d{4}\/\d{2}\/\d{2}\/[\w.-]+\/?$/.test(url.pathname)
        ? url.pathname.slice(7).replace(/\/$/, "")
        : "";
    } catch {
      return "";
    }
  }
  function onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      open = false;
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open = true;
      if (hits.length)
        active =
          (active + (event.key === "ArrowDown" ? 1 : -1) + hits.length) %
          hits.length;
    } else if (event.key === "Enter" && hits.length) {
      event.preventDefault();
      void goto(
        resolve("/entry/[...slug]", {
          slug: hitSlug(hits[Math.max(0, active)]),
        }),
      );
      open = false;
    }
  }
  afterNavigate(() => {
    query = "";
    open = false;
    active = -1;
    ready = true;
  });
  onMount(() => {
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.contains(event.target))
        open = false;
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  });
  $effect(() => {
    const term = query.trim();
    const provider = client;
    const indexName = config?.indexName;
    const controller = new AbortController();
    if (!term) {
      hits = [];
      loading = false;
      error = "";
      active = -1;
      return;
    }
    loading = true;
    error = "";
    active = -1;
    const timer = setTimeout(async () => {
      try {
        let results: SearchHit[];
        if (provider && indexName) {
          const response = await provider.searchForHits<SearchHit>({
            requests: [{ indexName, query: term, hitsPerPage: 8 }],
          });
          results = response.results[0]?.hits ?? [];
        } else {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(term)}`,
            { signal: controller.signal },
          );
          if (!response.ok) throw new Error("Search request failed");
          results = ((await response.json()) as { hits: SearchHit[] }).hits;
        }
        if (!controller.signal.aborted) hits = results;
      } catch {
        if (!controller.signal.aborted) {
          hits = [];
          error = "Search is unavailable. Please try again.";
        }
      } finally {
        if (!controller.signal.aborted) loading = false;
      }
    }, 150);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  });
</script>

<div bind:this={root} class="post-search">
  <div class="post-search__field">
    <input
      disabled={!ready}
      class="post-search__input"
      type="search"
      aria-label="Search posts"
      placeholder="Search posts"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open && !!query.trim()}
      aria-controls="search-results"
      aria-activedescendant={open && active >= 0 && hits[active]
        ? `search-hit-${active}`
        : undefined}
      autocomplete="off"
      bind:value={query}
      onfocus={() => {
        open = true;
      }}
      oninput={() => {
        open = true;
      }}
      onkeydown={onKeydown}
    />
  </div>
  {#if open && query.trim()}
    <div class="post-search__panel">
      {#if loading}
        <p role="status" class="post-search__status">Searching...</p>
      {/if}
      {#if error}
        <p role="alert" class="post-search__error">
          {error}
        </p>
      {/if}
      <ul id="search-results" role="listbox" aria-label="Search results">
        {#each hits as hit, index (hit.objectID)}
          <li
            role="option"
            aria-selected={active === index}
            id={`search-hit-${index}`}
            class="post-search__option"
          >
            <a
              class="post-search__link"
              href={resolve("/entry/[...slug]", { slug: hitSlug(hit) })}
              onclick={() => {
                open = false;
              }}
              ><div class="post-search__title">
                {hit.title ?? hit.slug ?? "Untitled"}
              </div>
              {#if hit.snippet}
                <div class="post-search__snippet">
                  {hit.snippet}
                </div>
              {/if}</a
            >
          </li>
        {/each}
      </ul>
      {#if !loading && !error && !hits.length}
        <p role="status" class="post-search__status">No posts found.</p>
      {/if}
    </div>
  {/if}
</div>
