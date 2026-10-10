import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { devices } from "playwright";
import { posts } from "../../src/lib/server/posts.ts";
import { browserFixture, waitFor } from "../support/browser.ts";

for (const [name, device] of [
  ["desktop", devices["Desktop Chrome"]],
  ["mobile", devices["Pixel 7"]],
] as const) {
  describe(`site / ${name}`, () => {
    const fixture = browserFixture(
      process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:5175",
      device,
    );
    it("all existing content URLs render and feeds list every article", {
      timeout: 60_000,
    }, async () => {
      const { request } = fixture;
      for (const post of posts) {
        const response = await request.get(`/entry/${post.slug}`);
        assert.equal(response.status(), 200, post.slug);
        const html = await response.text();
        assert.ok(
          html.includes('property="og:type" content="article"'),
          post.slug,
        );
        assert.ok(
          html.includes('property="article:published_time"'),
          post.slug,
        );
        assert.ok(!html.includes('aria-label="Like'));
      }
      for (const path of [
        "/",
        "/about",
        "/graph",
        "/healthz",
        "/robots.txt",
        "/favicon.ico",
        "/profile-pic.jpg",
        "/styles.css",
        "/design-tokens.css",
      ]) {
        assert.equal((await request.get(path)).status(), 200, path);
      }
      const css = await (await request.get("/styles.css")).text();
      assert.ok(css.includes('url("./design-tokens.css")'));
      assert.ok(!css.includes("@tailwind"));
      const rss = await request.get("/rss.xml");
      assert.ok(rss.headers()["content-type"].includes("xml"));
      assert.ok(rss.headers()["cache-control"].includes("max-age=600"));
      assert.equal((await rss.text()).match(/<item>/g)?.length, posts.length);
      const sitemap = await (await request.get("/sitemap.xml")).text();
      assert.equal(sitemap.match(/<url>/g)?.length, posts.length + 3);
      assert.ok(!sitemap.includes("/healthz"));
      for (const path of [
        "/missing-page",
        "/entry/1900/01/01/missing",
        "/api/likes",
      ]) {
        assert.equal((await request.get(path)).status(), 404, path);
      }
    });
    it("pagination, search, article metadata and client navigation work", {
      timeout: 60_000,
    }, async () => {
      const { page } = fixture;
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      await waitFor(
        async () => (await page.locator("article").count()) === 10,
        "Initial article list",
      );
      // Check that the native stylesheet and shared tokens reached the browser.
      assert.equal(
        await page
          .locator(".site-shell")
          .evaluate((el) => getComputedStyle(el).display),
        "flex",
      );
      assert.equal(
        await page
          .locator("body")
          .evaluate((el) =>
            getComputedStyle(el)
              .getPropertyValue("--layout-content-width")
              .trim(),
          ),
        "64rem",
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        "Home must fit the viewport",
      );
      await page.screenshot({
        path: `test-results/home-${name}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: "Load more" }).click();
      await waitFor(
        async () => (await page.locator("article").count()) >= 20,
        "Manual pagination",
      );
      for (
        let round = 0;
        (await page.locator("article").count()) < posts.length && round < 20;
        round++
      ) {
        const count = await page.locator("article").count();
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight),
        );
        await waitFor(
          async () => (await page.locator("article").count()) > count,
          "Automatic pagination",
        );
      }
      assert.equal(await page.locator("article").count(), posts.length);
      assert.equal(
        await page.getByRole("button", { name: "Load more" }).count(),
        0,
      );
      const paths = await page
        .locator("article > a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      assert.equal(new Set(paths).size, posts.length);
      await page.getByRole("combobox", { name: "Search posts" }).fill("neovim");
      await page
        .getByRole("listbox", { name: "Search results" })
        .waitFor({ state: "visible" });
      const result = page
        .getByRole("listbox")
        .getByRole("link")
        .filter({ hasText: /neovim/i })
        .first();
      const href = await result.getAttribute("href");
      await result.click();
      await page.waitForURL((url) => url.pathname === href);
      assert.ok((await page.locator("main > h1").textContent())?.trim());
      await waitFor(
        async () =>
          (await page
            .locator('meta[property="og:type"]')
            .getAttribute("content")) === "article",
        "Article metadata",
      );
      assert.equal(
        await page.getByRole("combobox", { name: "Search posts" }).inputValue(),
        "",
      );
      await page.getByRole("link", { name: "Home", exact: true }).click();
      await page.waitForURL(/\/$/);
      await waitFor(
        async () => (await page.locator("article").count()) === 10,
        "Home navigation resets pagination",
      );
      await page
        .getByRole("combobox", { name: "Search posts" })
        .fill("no-matching-post-xyz");
      await waitFor(
        async () =>
          (await page.getByRole("status").textContent()) === "No posts found.",
        "Empty search results",
      );
      assert.deepEqual(errors, []);
    });
    it("graph canvas, controls, filtering and navigation work", async () => {
      const { page } = fixture;
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/graph");
      const canvas = page.getByLabel("Article connections graph");
      await canvas.waitFor({ state: "visible" });
      await waitFor(
        async () =>
          await canvas.evaluate((el: HTMLCanvasElement) => {
            const context = el.getContext("2d");
            return context?.getImageData(0, 0, 1, 1).data[3] === 255;
          }),
        "Canvas painted its first frame",
      );
      assert.ok(
        await page.getByRole("button", { name: "Toggle theme" }).isEnabled(),
      );
      await page.screenshot({
        path: `test-results/graph-dark-${name}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: "Toggle theme" }).click();
      await waitFor(
        async () =>
          (await canvas.locator("..").getAttribute("data-theme")) === "light",
        "Graph theme",
      );
      await waitFor(
        async () =>
          await canvas.evaluate((el: HTMLCanvasElement) => {
            const pixel = el.getContext("2d")?.getImageData(0, 0, 1, 1).data;
            return pixel?.[0] === 248 && pixel[1] === 250 && pixel[2] === 252;
          }),
        "Light canvas palette is rendered",
      );
      await page.screenshot({
        path: `test-results/graph-light-${name}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: "Zoom in", exact: true }).click();
      await page.getByRole("button", { name: "Zoom out", exact: true }).click();
      await page.getByRole("button", { name: "Reset position" }).click();
      await page.getByRole("checkbox", { name: "Orphans" }).uncheck();
      await page.getByRole("checkbox", { name: "Orphans" }).check();
      const bounds = await canvas.boundingBox();
      assert.ok(bounds);
      await page.mouse.move(
        bounds.x + bounds.width * 0.7,
        bounds.y + bounds.height * 0.7,
      );
      await page.mouse.wheel(0, 120);
      await page.mouse.down();
      await page.mouse.move(
        bounds.x + bounds.width * 0.6,
        bounds.y + bounds.height * 0.6,
      );
      await page.mouse.up();
      await page
        .getByRole("searchbox", { name: "Search notes" })
        .fill("neovim");
      const matches = page.getByRole("list", { name: "Matching articles" });
      await matches.getByRole("link").first().waitFor({ state: "visible" });
      await matches.getByRole("link").first().click();
      await page.waitForURL(/\/entry\//);
      assert.ok((await page.locator("main > h1").textContent())?.trim());
      await page.goBack();
      await canvas.waitFor({ state: "visible" });
      assert.deepEqual(errors, []);
    });
    it("navigation menu and About work across viewport sizes", async () => {
      const { page } = fixture;
      await page.goto("/");
      if (name === "mobile") {
        await page.getByRole("button", { name: "Open menu" }).click();
        const nav = page.getByRole("navigation", { name: "Mobile navigation" });
        await nav.waitFor({ state: "visible" });
        await nav.getByRole("link", { name: "About me" }).click();
        await page
          .getByRole("button", { name: "Open menu" })
          .waitFor({ state: "visible" });
        assert.equal(await nav.count(), 0);
      } else {
        await page
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "About me" })
          .click();
      }
      await page.waitForURL(/\/about$/);
      await page
        .getByRole("heading", { name: "About me", exact: true })
        .waitFor({ state: "visible" });
      await page
        .getByRole("heading", { name: "Profile", exact: true })
        .waitFor({ state: "visible" });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        "About must fit the viewport",
      );
      await page.screenshot({
        path: `test-results/about-${name}.png`,
        fullPage: true,
      });
    });
  });
}
