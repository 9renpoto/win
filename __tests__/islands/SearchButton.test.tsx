import docsearch from "https://esm.sh/@docsearch/js@3?target=es2020";
import { cleanup, render, setup } from "$fresh-testing-library/components.ts";
import { fn } from "$fresh-testing-library/expect.ts";
import { assert } from "@std/assert";
import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";
import SearchButton from "../../islands/SearchButton.tsx";

describe("islands/SearchButton.tsx", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should contain class applied in props", () => {
    const dsearch = fn(docsearch).mockImplementation(
      // create mock implementation of docsearch
      // @ts-ignore mock impl
      (
        _applId: string,
        _apiKey: string,
        _indexName: string,
        _container: HTMLElement | string,
      ) => {},
    );
    const { getByTitle } = render(
      <SearchButton class="font-bold" docsearch={dsearch} />,
    );
    const search = getByTitle("Search Button");
    assert(search.classList.contains("font-bold"));
  });
});
