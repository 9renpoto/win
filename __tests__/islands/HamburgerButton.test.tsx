import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import HamburgerButton from "@/islands/HamburgerButton.tsx";

describe("HamburgerButton", () => {
  it("renders hamburger button in collapsed state initially", () => {
    const { container, getByRole } = render(
      <HamburgerButton>
        <li>
          <a href="/about">About</a>
        </li>
      </HamburgerButton>,
    );

    const button = getByRole("button");
    // Preact boolean attribute rendering boolean false may omit or set "false" depending on runtime
    const expanded = button.getAttribute("aria-expanded");
    assertEquals(expanded === "false" || expanded === null, true);
    assertEquals(container.querySelector("ul"), null);
  });
});
