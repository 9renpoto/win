import { defineEnvVars } from "@sveltejs/kit/env";

const optional = { schema: (value: string | undefined) => value ?? "" };
export const variables = defineEnvVars({
  ALGOLIA_APP_ID: optional,
  ALGOLIA_SEARCH_API_KEY: optional,
  ALGOLIA_INDEX_NAME: optional,
  GA4_MEASUREMENT_ID: optional,
  SITE_URL: optional,
});
