<script lang="ts">
  import Bio from "#lib/components/Bio.svelte";
  import PostList from "#lib/components/PostList.svelte";
  import SEO from "#lib/components/SEO.svelte";
  import { description, siteUrl, title } from "#lib/website.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<SEO {title} {description} url={siteUrl} />
<main class="page page--home">
  <Bio />
  <div class="home-posts">
    {#key data.posts}
      <PostList initialPosts={data.posts} initialHasMore={data.hasMore} />
    {/key}
  </div>
</main>
