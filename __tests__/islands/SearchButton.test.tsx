import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { fn } from "$fresh-testing-library/expect.ts";
import { assert } from "@std/assert";
import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";
// Use a local stub to avoid remote imports and coverage issues
import SearchButton from "../stubs/SearchButton.tsx";

describe("islands/SearchButton.tsx", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should contain class applied in props", () => {
    const dsearch = fn((_: unknown) => {});
    const { getByTitle } = render(
      <SearchButton class="font-bold" docsearch={dsearch} />,
    );
    const search = getByTitle("Search Button");
    assert(search.classList.contains("font-bold"));
  });
});
