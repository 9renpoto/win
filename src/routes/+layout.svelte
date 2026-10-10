<script lang="ts">
  import { onMount } from "svelte";
  import {
    refreshInstagramEmbeds,
    resizeSocialEmbed,
  } from "#lib/browser/embeds.ts";
  import Analytics from "#lib/components/Analytics.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import Header from "#lib/components/Header.svelte";
  import { afterNavigate } from "$app/navigation";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();
  onMount(() => {
    window.addEventListener("message", resizeSocialEmbed);
    return () => window.removeEventListener("message", resizeSocialEmbed);
  });
  afterNavigate(() => {
    refreshInstagramEmbeds();
  });
</script>

<div class="site-shell">
  <Header searchConfig={data.searchConfig} />
  {@render children()}
  <Footer />
</div>
<Analytics measurementId={data.gaMeasurementId} />
