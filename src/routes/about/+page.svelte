<script lang="ts">
  import SEO from "#lib/components/SEO.svelte";
  import { formatPostDate } from "#lib/date.ts";
  import { description, siteUrl, title } from "#lib/website.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<SEO
  title={`${data.post.title} | ${title}`}
  {description}
  url={`${siteUrl}/about`}
/>
<main class="page">
  <h1 class="page-title">{data.post.title}</h1>
  <time class="article-meta" datetime={data.post.publishedAt}
    >{formatPostDate(data.post.publishedAt)}</time
  >
  <div class="article-content">
    {@html data.post.html}
  </div>
</main>
