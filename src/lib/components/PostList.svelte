<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { formatPostDate } from "#lib/date.ts";
  import type { PostItem } from "#lib/types.ts";
  import { resolve } from "$app/paths";

  let {
    initialPosts,
    initialHasMore,
  }: { initialPosts: PostItem[]; initialHasMore: boolean } = $props();
  let extraPosts = $state<PostItem[]>([]);
  let hasMoreOverride = $state<boolean | null>(null);
  let loading = $state(false);
  let loadError = $state("");
  let sentinel: HTMLDivElement;
  let nextPage = 2;
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  const controller = new AbortController();
  const posts = $derived([...initialPosts, ...extraPosts]);
  const hasMore = $derived(hasMoreOverride ?? initialHasMore);
  onDestroy(() => controller.abort());

  async function loadMore(): Promise<void> {
    if (loading || !hasMore) return;
    loading = true;
    loadError = "";
    try {
      const response = await fetch(`/api/posts?page=${nextPage}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Post request failed");
      const result = (await response.json()) as {
        posts: PostItem[];
        hasMore: boolean;
      };
      extraPosts = [...extraPosts, ...result.posts];
      hasMoreOverride = result.hasMore;
      nextPage++;
    } catch {
      if (!controller.signal.aborted) loadError = "Failed to load more posts";
    } finally {
      loading = false;
    }
  }
  $effect(() => {
    const count = posts.length;
    if (
      !sentinel ||
      !hasMore ||
      count === 0 ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  });
</script>

<div>
  {#each posts as post (post.slug)}
    <article class="post-list__item">
      <a href={resolve("/entry/[...slug]", { slug: post.slug })}>
        <h3 class="post-list__title">{post.title}</h3>
        <time datetime={post.publishedAt} class="post-list__date"
          >{formatPostDate(post.publishedAt)}</time
        >
        <div class="post-list__snippet">
          {post.snippet}
        </div>
      </a>
    </article>
  {/each}
  <div bind:this={sentinel} class="post-list__sentinel"></div>
  {#if loading}
    <div class="post-list__status" role="status">Loading...</div>
  {/if}
  {#if loadError}
    <div class="post-list__error" role="alert">
      {loadError}
    </div>
  {/if}
  {#if hasMore && !loading}
    <div class="post-list__actions">
      <button
        type="button"
        disabled={!ready}
        class="post-list__more"
        onclick={() => void loadMore()}
      >
        Load more
      </button>
    </div>
  {/if}
</div>
