import { afterEach, beforeAll, describe, it } from "$std/testing/bdd.ts";
import { assertExists } from "$std/testing/asserts.ts";
import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { Header } from "../components/Header.tsx";

describe("Header", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should exists.", () => {
    const { container } = render(
      <Header title="title" />,
    );

    assertExists(container);
  });
});
