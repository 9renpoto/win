import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import { TableOfContents } from "@/components/TableOfContents.tsx";

describe("TableOfContents", () => {
  it("renders nested lists for heading levels without mutating input", () => {
    const headings = [
      { level: 1, text: "Introduction", slug: "intro" },
      { level: 2, text: "Details", slug: "details" },
      { level: 2, text: "More Details", slug: "more-details" },
      { level: 1, text: "Conclusion", slug: "conclusion" },
    ];
    const snapshot = headings.map((item) => ({ ...item }));

    const { container, getByText } = render(
      <TableOfContents headings={headings} />,
    );

    const introLink = getByText("Introduction", { selector: "a" });
    const detailsLink = getByText("Details", { selector: "a" });
    const conclusionLink = getByText("Conclusion", { selector: "a" });
    const nestedList = container.querySelector(
      "ul.toc-level-1 li ul.toc-level-2",
    );

    assert(introLink);
    assert(detailsLink);
    assert(conclusionLink);
    assert(nestedList, "Nested list should exist for deeper headings");
    assertEquals(headings, snapshot);
  });
});
