<script lang="ts">
  import SEO from "#lib/components/SEO.svelte";
  import TableOfContents from "#lib/components/TableOfContents.svelte";
  import { formatPostDate } from "#lib/date.ts";
  import { description, siteUrl, title } from "#lib/website.ts";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const post = $derived(data.post);
</script>

<SEO
  title={`${post.title} | ${title}`}
  description={post.snippet || description}
  url={`${siteUrl}/entry/${post.slug}`}
  type="article"
  publishedAt={post.publishedAt}
/>
<div class="page">
  <div class="article-layout">
    <main class="article-main">
      <h1 class="page-title">{post.title}</h1>
      <div class="article-metadata">
        <time datetime={post.publishedAt} class="article-meta"
          >{formatPostDate(post.publishedAt)}</time
        >
        <p class="article-meta">Number of word {post.content.length}</p>
      </div>
      <div class="article-content">
        {@html post.html}
      </div>
    </main>
    {#if post.headings.length}
      <aside class="article-sidebar">
        <div class="article-sidebar__sticky">
          <TableOfContents headings={post.headings} />
        </div>
      </aside>
    {/if}
  </div>
</div>
