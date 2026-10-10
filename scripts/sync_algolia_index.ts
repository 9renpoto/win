import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SearchRecord as AlgoliaRecord } from "../src/lib/types.ts";
import { loadRepositoryContent } from "./content.ts";

interface AlgoliaBatchRequest {
  action: "updateObject";
  body: AlgoliaRecord;
}

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;
const DRY_RUN = process.env.ALGOLIA_DRY_RUN === "1";

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function algoliaWriteRequest(
  appId: string,
  apiKey: string,
  path: string,
  body?: unknown,
): Promise<Response> {
  // The Distributed Search Network host (`${appId}-dsn.algolia.net`) is for
  // search traffic. Indexing requests must go to the primary API endpoint.
  return await fetch(`https://${appId}.algolia.net${path}`, {
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
  const res = await algoliaWriteRequest(
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
    const res = await algoliaWriteRequest(
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
      `Indexed ${Math.min(
        i + chunkSize,
        requests.length,
      )} / ${requests.length}`,
    );
  }
}

async function main(): Promise<void> {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const { search: records } = await loadRepositoryContent(root);

  console.log(
    `Prepared ${records.length} records for index ${ALGOLIA_INDEX_NAME ?? "(not configured)"}.`,
  );

  if (DRY_RUN) {
    console.log("ALGOLIA_DRY_RUN=1: skipping write to Algolia.");
    return;
  }

  const appId = required("ALGOLIA_APP_ID", ALGOLIA_APP_ID);
  const apiKey = required("ALGOLIA_ADMIN_API_KEY", ALGOLIA_ADMIN_API_KEY);
  const indexName = required("ALGOLIA_INDEX_NAME", ALGOLIA_INDEX_NAME);
  await clearIndex(appId, apiKey, indexName);
  await batchIndex(appId, apiKey, indexName, records);
  console.log("Algolia sync completed.");
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await main();
}
