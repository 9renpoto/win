<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
</script>

<svelte:head
  ><title>{page.status} | Blog</title>
  <meta name="robots" content="noindex" /></svelte:head
>
<main class="page page--error">
  <h1>{page.status}</h1>
  <p>{page.error?.message}</p>
  <a class="page-error__link" href={resolve("/")}>Back to home</a>
</main>
