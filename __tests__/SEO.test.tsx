import { afterEach, beforeAll, describe, it } from "$std/testing/bdd.ts";
import { assertExists } from "$std/testing/asserts.ts";
import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { SEO } from "@/components/SEO.tsx";

describe("Footer", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should exists.", () => {
    const { container } = render(
      <SEO
        title="title"
        description="description"
        ogImage="ogImage"
        keywords="keywords"
      />,
    );

    assertExists(container);
  });
});
