import "https://deno.land/std@0.192.0/dotenv/load.ts";
import algoliasearch from "algoliasearch";
import { getPosts } from "@/utils/posts.ts";

const appId = Deno.env.get("ALGOLIA_APP_ID");
const adminKey = Deno.env.get("ALGOLIA_ADMIN_KEY");
const indexName = Deno.env.get("ALGOLIA_INDEX_NAME");

if (!appId || !adminKey || !indexName) {
  console.error(
    "ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, and ALGOLIA_INDEX_NAME must be set",
  );
  Deno.exit(1);
}

const client = algoliasearch(appId, adminKey);
const index = client.initIndex(indexName);

const posts = await getPosts();

const records = posts.map((post) => ({
  objectID: post.slug,
  title: post.title,
  snippet: post.snippet,
  content: post.content,
  publishedAt: post.publishedAt.toISOString(),
}));

try {
  await index.saveObjects(records);
  console.log("Algolia index updated successfully!");
} catch (error) {
  console.error("Failed to update Algolia index:", error);
  Deno.exit(1);
}
