<script lang="ts">
  import GraphView from "#lib/components/GraphView.svelte";
  import SEO from "#lib/components/SEO.svelte";
  import { siteUrl, title } from "#lib/website.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<SEO
  title={`Graph View | ${title}`}
  description={`Interactive graph view visualizing connections between articles on ${title}`}
  url={`${siteUrl}/graph`}
  keywords="graph,notes,obsidian,articles"
/>
<main class="page page--graph">
  <div class="graph-introduction">
    <h1 class="page-title">Graph View</h1>
    <p class="graph-introduction__description">
      Visualizing connections between articles inspired by Obsidian.
    </p>
  </div>
  <GraphView data={data.graph} />
</main>
