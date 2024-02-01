import { beforeEach, describe, it } from "$std/testing/bdd.ts";
import { assertExists } from "$std/testing/asserts.ts";
import { DOMParser, render } from "./deps.ts";
import { Header } from "../components/Header.tsx";

describe("Header", () => {
  beforeEach(() => {
    // deno-lint-ignore no-window
    window.document = new DOMParser().parseFromString(
      "",
      "text/html",
    ) as unknown as Document;
  });

  it.skip("should exists.", () => {
    const { container } = render(
      <Header title="title" />,
    );

    assertExists(container);
  });
});
