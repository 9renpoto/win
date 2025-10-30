import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import { Header } from "@/components/Header.tsx";

describe("Header", () => {
  it("renders navigation links and title", () => {
    const { getByText, container } = render(<Header title="win blog" />);

    const titleLink = container.querySelector('a[href="/"]') as
      | HTMLAnchorElement
      | null;
    const aboutLink = getByText("About me", { selector: "a" });
    const rssLink = container.querySelector('a[href="/rss.xml"]') as
      | HTMLAnchorElement
      | null;
    const statusLink = container.querySelector(
      'a[href="https://9renpoto.github.io/upptime"]',
    ) as HTMLAnchorElement | null;
    const menuButton = container.querySelector('button[title="Open menu"]') as
      | HTMLButtonElement
      | null;

    assert(titleLink, "Title link should exist");
    assertEquals(titleLink?.textContent?.trim(), "win blog");
    assertEquals(aboutLink.textContent?.trim(), "About me");
    assert(rssLink, "RSS link should exist");
    assert(statusLink, "Status link should exist");
    assert(menuButton, "Hamburger button should exist");
    assertEquals(menuButton?.getAttribute("type"), "button");
    assertEquals(
      menuButton?.getAttribute("aria-expanded") ?? "false",
      "false",
    );
  });
});
