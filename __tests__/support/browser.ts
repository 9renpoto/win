import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach } from "node:test";
import { setTimeout } from "node:timers/promises";
import {
  type APIRequestContext,
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  chromium,
  type Page,
} from "playwright";

export function browserFixture(
  baseURL: string,
  options: BrowserContextOptions,
) {
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let page: Page;
  let request: APIRequestContext;
  before(async () => {
    browser = await chromium.launch();
  });
  beforeEach(async () => {
    assert.ok(browser);
    context = await browser.newContext({ ...options, baseURL });
    page = await context.newPage();
    page.setDefaultTimeout(10_000);
    request = context.request;
  });
  afterEach(async () => {
    await context?.close();
  });
  after(async () => {
    await browser?.close();
  });
  return {
    get page() {
      return page;
    },
    get request() {
      return request;
    },
  };
}

export async function waitFor(
  condition: () => Promise<boolean>,
  message: string,
  timeout = 10_000,
) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await condition()) return;
    await setTimeout(50);
  }
  assert.fail(message);
}
