<script lang="ts">
  import { author, title as siteTitle } from "#lib/website.ts";

  let {
    title,
    description,
    url,
    type = "website",
    publishedAt,
    keywords = "life",
  }: {
    title: string;
    description: string;
    url?: string;
    type?: "website" | "article";
    publishedAt?: string;
    keywords?: string;
  } = $props();
  const image = "https://avatars3.githubusercontent.com/u/520693?s=460&v=4";
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  {#if url}
    <meta property="og:url" content={url} />
    <link rel="canonical" href={url} />
  {/if}
  <meta property="og:site_name" content={siteTitle} />
  <meta property="og:type" content={type} />
  <meta property="og:locale" content="ja_JP" />
  {#if type === "article"}
    {#if publishedAt}
      <meta property="article:published_time" content={publishedAt} />
    {/if}
    <meta property="article:author" content={author} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@9renpoto" />
  <meta name="twitter:creator" content="@9renpoto" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="keywords" content={keywords} />
</svelte:head>
