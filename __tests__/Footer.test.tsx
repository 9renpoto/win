import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";
import { assertExists } from "@std/testing/asserts";
import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { Footer } from "@/components/Footer.tsx";

describe("Footer", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should exists.", () => {
    const { container } = render(
      <Footer />,
    );

    assertExists(container);
  });
});
