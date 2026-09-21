import { assert, assertEquals } from "@std/assert";
import { launch } from "@astral/astral";

Deno.test("Visual test - capture homepage screenshot and verify page elements via Astral", async () => {
  const html = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>win blog</title>
    <style>
      body {
        font-family: sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f9fafb;
        color: #111827;
      }
      header {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      h1 {
        font-size: 24px;
        margin: 0;
      }
      .post {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1 id="title">win blog</h1>
    </header>
    <main>
      <article class="post">
        <h2>Visual Testing with Astral</h2>
        <p>Testing Deno applications visually using Astral browser automation.</p>
      </article>
    </main>
  </body>
</html>`;

  const server = Deno.serve({ port: 0 }, () =>
    new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    }));

  const port = server.addr.port;

  try {
    const launchOptions = Deno.env.get("CI") || Deno.build.os === "linux"
      ? { args: ["--no-sandbox", "--disable-setuid-sandbox", "--headless=new"] }
      : {};

    await using browser = await launch(launchOptions);
    await using page = await browser.newPage(`http://localhost:${port}`);

    const titleElement = await page.$("#title");
    assert(titleElement, "Title element should be present");

    const pageTitle = await page.evaluate(() => document.title);
    assertEquals(pageTitle, "win blog");

    const screenshot = await page.screenshot();
    assert(screenshot instanceof Uint8Array, "Screenshot should be a Uint8Array");
    assert(screenshot.byteLength > 0, "Screenshot should not be empty");
  } finally {
    await server.shutdown();
  }
});
