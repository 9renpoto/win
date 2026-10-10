<script lang="ts">
  import SEO from "#lib/components/SEO.svelte";
  import { description, title } from "#lib/website.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<SEO title={`health | ${title}`} {description} />
<main class="page">This blog has {data.count} entries.</main>
