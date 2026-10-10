import { dev } from "$app/env";
import {
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX_NAME,
  ALGOLIA_SEARCH_API_KEY,
  GA4_MEASUREMENT_ID,
} from "$app/env/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = () => ({
  searchConfig:
    ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY && ALGOLIA_INDEX_NAME
      ? {
          appId: ALGOLIA_APP_ID,
          apiKey: ALGOLIA_SEARCH_API_KEY,
          indexName: ALGOLIA_INDEX_NAME,
        }
      : null,
  gaMeasurementId: dev ? "" : GA4_MEASUREMENT_ID,
});
