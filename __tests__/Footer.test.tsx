import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { Footer } from "@/components/Footer.tsx";
import { assertExists } from "@std/testing/asserts";
import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";

describe("Footer", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should exists.", () => {
    const { container } = render(<Footer />);

    assertExists(container);
  });
});
