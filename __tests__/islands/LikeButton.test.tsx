import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import LikeButton from "@/islands/LikeButton.tsx";

describe("LikeButton", () => {
  it("renders like button with initial state", () => {
    const { getByRole, getByText } = render(<LikeButton slug="test-post" />);
    const button = getByRole("button");
    assertEquals(button.getAttribute("aria-label"), "Like this post");
    assertEquals(getByText("0") !== null, true);
  });

  it("renders footer variant", () => {
    const { getByRole } = render(<LikeButton slug="test-post" variant="footer" />);
    const button = getByRole("button");
    assertEquals(button.classList.contains("p-2"), true);
  });
});
