import { assert } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import { Footer } from "@/components/Footer.tsx";
import { author } from "@/utils/website.ts";

describe("Footer", () => {
  it("displays author information and external links", () => {
    const { getByText, container } = render(<Footer />);

    const authorName = getByText(author);
    const lazyBuilder = getByText("Lazy builder");
    const statusLink = container.querySelector(
      'a[href="https://9renpoto.github.io/upptime/"]',
    ) as HTMLAnchorElement | null;
    const repositoryLink = container.querySelector(
      'a[href="https://github.com/9renpoto/win"]',
    ) as HTMLAnchorElement | null;

    assert(authorName);
    assert(lazyBuilder);
    assert(statusLink);
    assert(
      statusLink?.textContent?.includes("Status"),
      "Status link should be present",
    );
    assert(repositoryLink, "Repository link should exist");
    assert(
      container.textContent?.includes(
        `Copyright © ${new Date().getFullYear()}`,
      ),
      "Footer should include the current year",
    );
  });
});
