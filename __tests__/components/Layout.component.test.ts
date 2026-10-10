import assert from "node:assert/strict";
import { it } from "node:test";
import { JSDOM } from "jsdom";
import { render } from "svelte/server";
import Bio from "../../src/lib/components/Bio.svelte";
import Footer from "../../src/lib/components/Footer.svelte";
import { author } from "../../src/lib/website.ts";

it("retains the profile, Bluesky link, footer, and status link", () => {
  const profile = new JSDOM(render(Bio).body);
  const footer = new JSDOM(render(Footer).body);
  try {
    assert.ok(profile.window.document.body.textContent?.includes(author));
    assert.equal(
      profile.window.document.querySelector("a")?.getAttribute("href"),
      "https://bsky.app/profile/9renpoto.win",
    );
    const links = Array.from(footer.window.document.querySelectorAll("a"));
    assert.equal(
      links
        .find((link) => link.textContent?.trim() === "Status")
        ?.getAttribute("href"),
      "https://9renpoto.github.io/upptime/",
    );
    assert.equal(
      links
        .find((link) => link.getAttribute("aria-label") === "GitHub")
        ?.getAttribute("href"),
      "https://github.com/9renpoto/win",
    );
  } finally {
    profile.window.close();
    footer.window.close();
  }
});
