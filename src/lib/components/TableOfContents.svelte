<script lang="ts">
  import { buildHeadingTree } from "#lib/content/headings.ts";
  import type { Heading } from "#lib/types.ts";
  import HeadingList from "./HeadingList.svelte";

  let { headings }: { headings: Heading[] } = $props();
  const nodes = $derived(buildHeadingTree(headings));
</script>

{#if nodes.length}
  <aside class="toc" aria-label="Table of Contents">
    <h2>Table of Contents</h2>
    <HeadingList {nodes} />
  </aside>
{/if}
