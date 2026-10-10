<script lang="ts">
  import { author } from "#lib/website.ts";
</script>

<div class="author-bio">
  <img
    class="author-bio__avatar"
    src="/profile-pic.jpg"
    alt={author}
    width="40"
    height="40"
  />
  <p>
    Written by <strong>{author}</strong> who lives and works in Japan building
    useful things.
    <a href="https://bsky.app/profile/9renpoto.win"
      >You should follow him on Bluesky</a
    >
  </p>
</div>
