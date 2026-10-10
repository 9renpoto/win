<script lang="ts">
  import type { SearchConfig } from "#lib/types.ts";
  import { title } from "#lib/website.ts";
  import { afterNavigate } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Activity from "./icons/Activity.svelte";
  import Campfire from "./icons/Campfire.svelte";
  import Graph from "./icons/Graph.svelte";
  import Menu from "./icons/Menu.svelte";
  import Rss from "./icons/Rss.svelte";
  import X from "./icons/X.svelte";
  import Search from "./Search.svelte";

  let { searchConfig }: { searchConfig: SearchConfig | null } = $props();
  let isOpen = $state(false);
  let ready = $state(false);
  afterNavigate(() => {
    isOpen = false;
    ready = true;
  });
</script>

{#snippet links()}
  <a href={resolve("/graph")} aria-label="Graph" class="site-header__link"
    ><Graph /></a
  >
  <a href={resolve("/rss.xml")} aria-label="RSS" class="site-header__link"
    ><Rss /></a
  >
  <a
    href="https://9renpoto.github.io/upptime"
    aria-label="Status"
    class="site-header__link"
    ><Activity /></a
  >
  <a href={resolve("/about")} class="site-header__link">About me</a>
{/snippet}
<header class="site-header">
  <div class="site-header__inner">
    <div class="site-header__brand-row">
      <a href={resolve("/")} class="site-header__brand" aria-label="Home"
        ><Campfire />
        <span class="site-header__title">{title}</span></a
      >
      <div class="site-header__mobile">
        <button
          type="button"
          disabled={!ready}
          class="site-header__menu-button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onclick={() => {
            isOpen = !isOpen;
          }}
        >
          {#if isOpen}
            <X />
          {:else}
            <Menu />
          {/if}
        </button>
        {#if isOpen}
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            class="site-header__mobile-nav"
          >
            {@render links()}
          </nav>
        {/if}
      </div>
    </div>
    <div class="site-header__search">
      <Search config={searchConfig} />
    </div>
    <nav aria-label="Main navigation" class="site-header__desktop-nav">
      {@render links()}
    </nav>
  </div>
</header>
