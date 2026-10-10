<script lang="ts">
  import type { HeadingNode } from "#lib/content/headings.ts";
  import HeadingList from "./HeadingList.svelte";

  let { nodes, level = 1 }: { nodes: HeadingNode[]; level?: number } = $props();
</script>

<ul class={`toc-level-${level}`}>
  {#each nodes as node (node)}
    <li>
      <a href={`#${node.slug}`}>{@html node.text}</a>
      {#if node.children.length}
        <HeadingList nodes={node.children} level={level + 1} />
      {/if}
    </li>
  {/each}
</ul>
