import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { devices } from "playwright";
import { browserFixture, waitFor } from "../support/browser.ts";

for (const [name, device] of [
  ["desktop", devices["Desktop Chrome"]],
  ["mobile", devices["Pixel 7"]],
] as const) {
  describe(`production configuration / ${name}`, () => {
    const fixture = browserFixture(
      process.env.BROWSER_CONFIGURED_URL ?? "http://127.0.0.1:4175",
      device,
    );
    it("uses configured Algolia, keyboard navigation, and GA4 page views", async () => {
      const { page } = fixture;
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      let searched = false;
      await page.route(
        /https:\/\/.*\.algolia(net\.com|\.net)\//,
        async (route) => {
          searched = true;
          assert.ok((route.request().postData() ?? "").includes("neovim"));
          await route.fulfill({
            contentType: "application/json",
            body: JSON.stringify({
              results: [
                {
                  hits: [
                    {
                      objectID: "2016/12/17/first-nvim",
                      slug: "2016/12/17/first-nvim",
                      title: "Mock Algolia article",
                      snippet: "Keyboard result",
                    },
                  ],
                  nbHits: 1,
                  page: 0,
                  nbPages: 1,
                  hitsPerPage: 8,
                  processingTimeMS: 1,
                  query: "neovim",
                  params: "",
                },
              ],
            }),
          });
        },
      );
      await page.route("https://www.googletagmanager.com/**", (route) =>
        route.fulfill({ contentType: "text/javascript", body: "" }),
      );
      await page.goto("/");
      const input = page.getByRole("combobox", { name: "Search posts" });
      await input.fill("neovim");
      await page
        .getByRole("link", { name: "Mock Algolia article Keyboard result" })
        .waitFor({ state: "visible" });
      assert.equal(searched, true);
      await input.press("ArrowDown");
      await input.press("Enter");
      await page.waitForURL(/\/entry\/2016\/12\/17\/first-nvim$/);
      await waitFor(
        async () =>
          (await page.locator("main > h1").textContent()) === "neovim 導入",
        "Article heading",
      );
      assert.equal(
        await page.locator("script[src*='googletagmanager.com/gtag']").count(),
        1,
      );
      const events = await page.evaluate(
        () => (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [],
      );
      for (const path of ["/", "/entry/2016/12/17/first-nvim"]) {
        assert.ok(
          events.some(
            (event) =>
              event[0] === "event" &&
              event[1] === "page_view" &&
              (event[2] as { page_path: string }).page_path === path,
          ),
          path,
        );
      }
      assert.ok(
        !(await page.content()).includes(
          "browser-test-admin-key-must-stay-private",
        ),
      );
      assert.deepEqual(errors, []);
    });
  });
}
