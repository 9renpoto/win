import {
  cleanup,
  fireEvent,
  render,
  setup,
  waitFor,
} from "$fresh-testing-library/components.ts";
import { Header } from "@/components/Header.tsx";
import { assertExists } from "@std/assert";
import { afterEach, beforeAll, describe, it } from "@std/testing/bdd";

describe("Header", () => {
  beforeAll(setup);
  afterEach(cleanup);

  it("should exists.", () => {
    const { container } = render(<Header title="title" />);

    assertExists(container);
  });

  it("should open menu when hamburger button is clicked", async () => {
    const { getByTitle, getByText } = render(<Header title="title" />);

    const hamburgerButton = getByTitle("Open menu");
    fireEvent.click(hamburgerButton);

    await waitFor(() => {
      const aboutMenu = getByText("About me");
      assertExists(aboutMenu);
    });
  });
});
