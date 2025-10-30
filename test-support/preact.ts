import { getQueriesForElement, prettyDOM } from "@testing-library/dom";
import { parseHTML } from "linkedom";
import { renderToString } from "preact-render-to-string";
import type { VNode } from "preact";

type RenderQueries = ReturnType<typeof getQueriesForElement>;

export type RenderResult = RenderQueries & {
  container: HTMLElement;
  window: Window;
  debug: (el?: Element | Document) => void;
};

export const render = (ui: VNode): RenderResult => {
  const { window } = parseHTML("<!DOCTYPE html><html><body></body></html>");
  const { document } = window;

  if (typeof window.getComputedStyle !== "function") {
    const fallbackComputedStyle = () =>
      ({
        getPropertyValue: () => "",
        item: () => "",
        length: 0,
        removeProperty: () => "",
        setProperty: () => {},
      }) as unknown as CSSStyleDeclaration;
    (window as unknown as { getComputedStyle: typeof fallbackComputedStyle })
      .getComputedStyle = fallbackComputedStyle;
  }

  document.body.innerHTML = renderToString(ui);
  const container = document.body as unknown as HTMLElement;
  const queries = getQueriesForElement(container);

  return {
    ...queries,
    container,
    window: window as unknown as Window,
    debug: (el: Element | Document = container) => console.log(prettyDOM(el)),
  };
};
