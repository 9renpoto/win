import assert from "node:assert/strict";
import { it } from "node:test";
import { JSDOM } from "jsdom";
import { render } from "svelte/server";
import TableOfContents from "../../src/lib/components/TableOfContents.svelte";

it("renders nested headings without mutating input", () => {
  const headings = [
    { level: 1, text: "Introduction", slug: "intro" },
    { level: 2, text: "Details", slug: "details" },
    { level: 2, text: "More Details", slug: "more-details" },
    { level: 1, text: "Conclusion", slug: "conclusion" },
  ];
  const snapshot = structuredClone(headings);
  const view = new JSDOM(render(TableOfContents, { props: { headings } }).body);
  try {
    assert.equal(
      view.window.document.querySelector("a")?.getAttribute("href"),
      "#intro",
    );
    assert.notEqual(
      view.window.document.querySelector("ul.toc-level-1 li ul.toc-level-2"),
      null,
    );
    assert.deepEqual(headings, snapshot);
  } finally {
    view.window.close();
  }
});
it("supports skipped heading levels and empty heading lists", () => {
  const view = new JSDOM(
    render(TableOfContents, {
      props: {
        headings: [
          { level: 2, text: "First", slug: "first" },
          { level: 4, text: "Deep", slug: "deep" },
        ],
      },
    }).body,
  );
  const empty = new JSDOM(
    render(TableOfContents, { props: { headings: [] } }).body,
  );
  try {
    assert.equal(
      view.window.document.querySelector('a[href="#deep"]')?.textContent,
      "Deep",
    );
    assert.equal(empty.window.document.querySelector("aside"), null);
  } finally {
    view.window.close();
    empty.window.close();
  }
});
