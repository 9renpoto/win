import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import IconX from "@/components/icons/X.tsx";

describe("IconX", () => {
  it("renders svg with default props", () => {
    const { container } = render(<IconX />);
    const svg = container.querySelector("svg");
    assertEquals(svg !== null, true);
    assertEquals(svg?.getAttribute("width"), "24");
    assertEquals(svg?.getAttribute("height"), "24");
    assertEquals(svg?.getAttribute("stroke"), "currentColor");
    assertEquals(svg?.getAttribute("stroke-width"), "2");
  });

  it("renders svg with custom props", () => {
    const { container } = render(<IconX size={32} color="red" stroke={1.5} />);
    const svg = container.querySelector("svg");
    assertEquals(svg !== null, true);
    assertEquals(svg?.getAttribute("width"), "32");
    assertEquals(svg?.getAttribute("height"), "32");
    assertEquals(svg?.getAttribute("stroke"), "red");
    assertEquals(svg?.getAttribute("stroke-width"), "1.5");
  });
});
