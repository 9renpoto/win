import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { TableOfContents } from "@/components/TableOfContents.tsx";
import { assertExists } from "@std/assert";
import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";

describe("TableOfContents", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should render a list of headings", () => {
    const headings = [
      { level: 1, text: "Heading 1", slug: "heading-1" },
      { level: 2, text: "Heading 2", slug: "heading-2" },
      { level: 3, text: "Heading 3", slug: "heading-3" },
    ];

    const { getByText } = render(<TableOfContents headings={headings} />);

    assertExists(getByText("Heading 1"));
    assertExists(getByText("Heading 2"));
    assertExists(getByText("Heading 3"));
  });

  it("should render nested lists for nested headings", () => {
    const headings = [
      { level: 1, text: "Heading 1", slug: "heading-1" },
      { level: 2, text: "Heading 2", slug: "heading-2" },
      { level: 3, text: "Heading 3", slug: "heading-3" },
    ];

    const { container } = render(<TableOfContents headings={headings} />);
    const toc = container.querySelector(".toc");
    assertExists(toc);

    const level1List = toc.querySelector(".toc-level-1");
    assertExists(level1List);
    assertExists(level1List.querySelector("a[href='#heading-1']"));

    const level2List = level1List.querySelector(".toc-level-2");
    assertExists(level2List);
    assertExists(level2List.querySelector("a[href='#heading-2']"));

    const level3List = level2List.querySelector(".toc-level-3");
    assertExists(level3List);
    assertExists(level3List.querySelector("a[href='#heading-3']"));
  });
});
