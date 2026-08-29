import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import AlgoliaSearch from "@/islands/AlgoliaSearch.tsx";

describe("AlgoliaSearch", () => {
  it("renders null if missing required credentials", () => {
    const { container } = render(<AlgoliaSearch />);
    assertEquals(container.childNodes.length, 0);
  });

  it("renders search root div when credentials are provided", () => {
    const { container } = render(
      <AlgoliaSearch
        appId="TEST_APP_ID"
        apiKey="TEST_API_KEY"
        indexName="TEST_INDEX"
      />,
    );
    const searchRoot = container.querySelector("#algolia-search");
    assertEquals(searchRoot !== null, true);
    const searchBox = searchRoot?.querySelector(".algolia-search-box");
    assertEquals(searchBox !== null, true);
  });
});
