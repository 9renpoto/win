import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import { Bio } from "@/components/Bio.tsx";

describe("Bio", () => {
  it("renders the author and follow link", () => {
    const { container, getByRole, getByText } = render(
      <Bio author="Jane Doe" />,
    );
    const authorText = getByText(
      (_content: string, element?: Element | null) =>
        element?.tagName === "P" &&
        (element.textContent ?? "").includes("Written by Jane Doe"),
    );
    const followLink = getByRole("link", {
      name: "You should follow him on Bluesky",
    });

    assertEquals(authorText.tagName, "P");
    assertEquals(
      followLink.getAttribute("href"),
      "https://bsky.app/profile/9renpoto.win",
    );
    assertEquals(
      container.querySelector("img")?.getAttribute("src"),
      "/profile-pic.jpg",
    );
  });
});
