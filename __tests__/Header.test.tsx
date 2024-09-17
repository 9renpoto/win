import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { Header } from "@/components/Header.tsx";
import { assertExists } from "@std/testing/asserts";
import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";

describe("Header", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should exists.", () => {
    const { container } = render(<Header title="title" />);

    assertExists(container);
  });
});
