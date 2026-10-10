<script lang="ts">
  import { author } from "#lib/website.ts";
  import BrandGithub from "./icons/BrandGithub.svelte";
  import Campfire from "./icons/Campfire.svelte";
</script>

<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__profile">
      <div class="site-footer__identity">
        <Campfire />
        <div class="site-footer__name">{author}</div>
      </div>
      <div class="site-footer__muted">Lazy builder</div>
    </div>
    <div class="site-footer__links">
      <div class="site-footer__heading">Links</div>
      <ul class="site-footer__list">
        <li class="site-footer__list">
          <a
            href="https://9renpoto.github.io/upptime/"
            class="site-footer__link"
            >Status</a
          >
        </li>
      </ul>
    </div>
    <div class="site-footer__credits">
      <div class="site-footer__copyright">
        Copyright © {new Date().getUTCFullYear()} github.com/9renpoto<br />All
        right reserved.
      </div>
      <a
        href="https://github.com/9renpoto/win"
        class="site-footer__github"
        aria-label="GitHub"
        ><BrandGithub /></a
      >
    </div>
  </div>
</footer>
