import { getPosts } from "@/utils/posts.ts";

interface AlgoliaBatchRequest {
  action: "updateObject";
  body: AlgoliaRecord;
}

interface AlgoliaRecord {
  objectID: string;
  url: string;
  slug: string;
  title: string;
  snippet: string;
  content: string;
  publishedAt: string;
  mtime?: string;
}

const ALGOLIA_APP_ID = Deno.env.get("ALGOLIA_APP_ID");
const ALGOLIA_ADMIN_API_KEY = Deno.env.get("ALGOLIA_ADMIN_API_KEY");
const ALGOLIA_INDEX_NAME = Deno.env.get("ALGOLIA_INDEX_NAME");
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://9renpoto.win";
const DRY_RUN = Deno.env.get("ALGOLIA_DRY_RUN") === "1";

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function normalizeBaseUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function markdownToText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/\[[^\]]+\]\([^\)]*\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toRecord(
  post: Awaited<ReturnType<typeof getPosts>>[number],
  baseUrl: string,
): AlgoliaRecord {
  const content = markdownToText(post.content).slice(0, 4000);
  return {
    objectID: post.slug,
    slug: post.slug,
    url: `${baseUrl}/entry/${post.slug}`,
    title: post.title,
    snippet: post.snippet,
    content,
    publishedAt: post.publishedAt.toISOString(),
    mtime: post.mtime?.toISOString(),
  };
}

async function algoliaRequest(
  appId: string,
  apiKey: string,
  path: string,
  body?: unknown,
): Promise<Response> {
  return await fetch(`https://${appId}-dsn.algolia.net${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Algolia-API-Key": apiKey,
      "X-Algolia-Application-Id": appId,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function clearIndex(
  appId: string,
  apiKey: string,
  indexName: string,
): Promise<void> {
  const res = await algoliaRequest(
    appId,
    apiKey,
    `/1/indexes/${encodeURIComponent(indexName)}/clear`,
    {},
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to clear index: ${res.status} ${text}`);
  }
}

async function batchIndex(
  appId: string,
  apiKey: string,
  indexName: string,
  records: AlgoliaRecord[],
): Promise<void> {
  const requests: AlgoliaBatchRequest[] = records.map((record) => ({
    action: "updateObject",
    body: record,
  }));

  const chunkSize = 500;
  for (let i = 0; i < requests.length; i += chunkSize) {
    const chunk = requests.slice(i, i + chunkSize);
    const res = await algoliaRequest(
      appId,
      apiKey,
      `/1/indexes/${encodeURIComponent(indexName)}/batch`,
      { requests: chunk },
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to batch index: ${res.status} ${text}`);
    }
    console.log(
      `Indexed ${
        Math.min(i + chunkSize, requests.length)
      } / ${requests.length}`,
    );
  }
}

async function main(): Promise<void> {
  const appId = required("ALGOLIA_APP_ID", ALGOLIA_APP_ID);
  const apiKey = required("ALGOLIA_ADMIN_API_KEY", ALGOLIA_ADMIN_API_KEY);
  const indexName = required("ALGOLIA_INDEX_NAME", ALGOLIA_INDEX_NAME);
  const baseUrl = normalizeBaseUrl(SITE_URL);

  const posts = await getPosts();
  const records = posts.map((post) => toRecord(post, baseUrl));

  console.log(`Prepared ${records.length} records for index ${indexName}.`);

  if (DRY_RUN) {
    console.log("ALGOLIA_DRY_RUN=1: skipping write to Algolia.");
    return;
  }

  await clearIndex(appId, apiKey, indexName);
  await batchIndex(appId, apiKey, indexName, records);
  console.log("Algolia sync completed.");
}

if (import.meta.main) {
  await main();
}
