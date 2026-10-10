import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { JSDOM } from "jsdom";
import {
  refreshInstagramEmbeds,
  resizeSocialEmbed,
} from "../../src/lib/browser/embeds.ts";

let dom: JSDOM;
const originals = new Map<string, PropertyDescriptor | undefined>();
beforeEach(() => {
  dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", {
    url: "https://9renpoto.win",
  });
  for (const name of ["window", "document", "MessageEvent"] as const) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {
      configurable: true,
      value: dom.window[name],
    });
  }
});
afterEach(() => {
  dom.window.close();
  for (const [name, descriptor] of originals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  }
  originals.clear();
});

describe("social embeds", () => {
  it("accepts Bluesky resize messages only from the matching iframe and origin", () => {
    const frame = document.createElement("iframe");
    frame.dataset.bskyId = "post";
    document.body.append(frame);
    const send = (origin: string, source: Window | null, height: number) =>
      resizeSocialEmbed(
        new MessageEvent("message", {
          origin,
          source,
          data: { id: "post", height },
        }),
      );
    send("https://untrusted.example", frame.contentWindow, 900);
    send("https://embed.bsky.app", window, 900);
    send("https://embed.bsky.app", frame.contentWindow, NaN);
    assert.equal(frame.style.height, "");
    send("https://embed.bsky.app", frame.contentWindow, 420);
    assert.equal(frame.style.height, "420px");
  });
  it("handles X JSON messages and the minimum height without trusting another window", () => {
    const frame = document.createElement("iframe");
    frame.className = "x-embed-frame";
    document.body.append(frame);
    const send = (source: Window | null, data: unknown) =>
      resizeSocialEmbed(
        new MessageEvent("message", {
          origin: "https://platform.twitter.com",
          source,
          data,
        }),
      );
    send(window, { height: 800 });
    send(frame.contentWindow, "not JSON");
    assert.equal(frame.style.height, "");
    send(frame.contentWindow, '{"height":200}');
    assert.equal(frame.style.height, "360px");
    send(frame.contentWindow, { height: 500 });
    assert.equal(frame.style.height, "516px");
  });
  it("loads Instagram once and processes new article markup after navigation", () => {
    refreshInstagramEmbeds();
    assert.equal(document.querySelector("script[data-instagram-loader]"), null);
    document.body.innerHTML =
      '<blockquote class="instagram-media"></blockquote>';
    refreshInstagramEmbeds();
    refreshInstagramEmbeds();
    assert.equal(
      document.querySelectorAll("script[data-instagram-loader]").length,
      1,
    );
    const process = mock.fn();
    (window as Window & { instgrm?: { Embeds: { process(): void } } }).instgrm =
      { Embeds: { process } };
    refreshInstagramEmbeds();
    assert.equal(process.mock.callCount(), 1);
  });
});
