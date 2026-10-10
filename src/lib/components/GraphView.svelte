<script lang="ts">
  import { createGraphView, type GraphController } from "#lib/browser/graph.ts";
  import type { GraphData, GraphNode } from "#lib/types.ts";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  let { data }: { data: GraphData } = $props();
  let canvas = $state<HTMLCanvasElement>();
  let container = $state<HTMLDivElement>();
  let controller = $state.raw<GraphController | null>(null);
  let searchQuery = $state("");
  let showOrphans = $state(true);
  let theme = $state<"dark" | "light">("dark");
  let hovered = $state<GraphNode | null>(null);
  const isDark = $derived(theme === "dark");
  const matches = $derived(
    searchQuery.trim()
      ? data.nodes.filter(
          (node) =>
            (showOrphans || node.linkCount > 0) &&
            `${node.title} ${node.id}`
              .toLowerCase()
              .includes(searchQuery.trim().toLowerCase()),
        )
      : [],
  );
  $effect(() => {
    if (!canvas || !container) return;
    const view = createGraphView(
      canvas,
      container,
      data,
      (node) => {
        hovered = node;
      },
      (path) => goto(resolve("/entry/[...slug]", { slug: path.slice(7) })),
    );
    controller = view;
    return () => {
      view.dispose();
      controller = null;
    };
  });
  $effect(() => {
    controller?.setOptions({ searchQuery, showOrphans, theme });
  });
</script>

<div bind:this={container} class="graph-view" data-theme={theme}>
  <canvas
    bind:this={canvas}
    class="graph-view__canvas"
    aria-label="Article connections graph"
    >Interactive graph of article connections. Use the search below to find an
    article.</canvas
  >
  <div class="graph-view__toolbar">
    <div class="graph-view__panel graph-view__search">
      <input
        disabled={!controller}
        type="search"
        aria-label="Search notes"
        placeholder="Search notes..."
        bind:value={searchQuery}
        class="graph-view__input"
      />
      {#if searchQuery}
        <button
          type="button"
          disabled={!controller}
          aria-label="Clear graph search"
          onclick={() => {
            searchQuery = "";
          }}
        >
          ✕
        </button>
      {/if}
    </div>
    <div class="graph-view__panel graph-view__controls">
      <label class="graph-view__orphans"
        ><input
          disabled={!controller}
          type="checkbox"
          bind:checked={showOrphans}
          class="graph-view__checkbox"
        /><span>Orphans</span></label
      >
      <button
        type="button"
        disabled={!controller}
        title="Zoom in"
        aria-label="Zoom in"
        class="graph-view__button"
        onclick={() => controller?.zoomIn()}
      >
        +
      </button>
      <button
        type="button"
        disabled={!controller}
        title="Zoom out"
        aria-label="Zoom out"
        class="graph-view__button"
        onclick={() => controller?.zoomOut()}
      >
        −
      </button>
      <button
        type="button"
        disabled={!controller}
        title="Reset position"
        aria-label="Reset position"
        class="graph-view__button"
        onclick={() => controller?.resetView()}
      >
        ⟲
      </button>
      <button
        type="button"
        disabled={!controller}
        title="Toggle theme"
        aria-label="Toggle theme"
        class="graph-view__button"
        onclick={() => {
          theme = isDark ? "light" : "dark";
        }}
      >
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  </div>
  {#if searchQuery.trim()}
    <div class="graph-view__panel graph-view__matches">
      <ul aria-label="Matching articles">
        {#each matches as node (node.id)}
          <li class="graph-view__match">
            <a
              class="graph-view__link"
              href={resolve("/entry/[...slug]", { slug: node.id })}
              >{node.title}</a
            >
          </li>
        {/each}
      </ul>
      {#if !matches.length}
        <p>No matching articles.</p>
      {/if}
    </div>
  {/if}
  <div class="graph-view__footer">
    <div class="graph-view__panel graph-view__detail">
      {#if hovered}
        <a
          class="graph-view__title"
          href={resolve("/entry/[...slug]", { slug: hovered.id })}
          >{hovered.title}</a
        >
        <div class="graph-view__metadata">
          {hovered.publishedAt.slice(0, 10)}
          • {hovered.linkCount} connections {hovered.category ?? ""}
        </div>
        <div class="graph-view__metadata">Click node to open article</div>
      {:else}
        <span class="graph-view__hint"
          >Hover or drag a node • Scroll to zoom</span
        >
      {/if}
    </div>
    <div class="graph-view__panel graph-view__counts">
      {data.nodes.length}
      Notes • {data.edges.length} Links
    </div>
  </div>
</div>
