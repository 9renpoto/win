# private blog

[![codecov](https://codecov.io/gh/9renpoto/win/graph/badge.svg?token=m1sd1C4r5f)](https://codecov.io/gh/9renpoto/win)
[![CodeFactor](https://www.codefactor.io/repository/github/9renpoto/win/badge)](https://www.codefactor.io/repository/github/9renpoto/win)

## Usage

This project targets Deno 2.x (aligned with the
[CI workflow](.github/workflows/deno.yml)).

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## Local verification

To make sure the Vite build succeeds before pushing:

```
deno task build
```

If you want to inspect the production output locally, run:

```
deno task preview
```

This launches the prerendered build on port `8000`.

## DocSearch (Algolia)

This site can integrate [DocSearch](https://docsearch.algolia.com/).

There are two ways to use the search box in this app:

1. **DocSearch program (free)**: apply and wait for domain approval.
2. **Your own Algolia setup**: create your own Algolia index/crawler and use
	those credentials (no DocSearch domain approval required).

Then:

1. Set the credentials in your environment.
2. Start the app with `deno task start`.

Environment variables:

```
DOCSEARCH_APP_ID=...
DOCSEARCH_API_KEY=...
DOCSEARCH_INDEX_NAME=...
```

When the three variables are present, a search box is rendered in the header. If
they are missing, the UI stays hidden.

### If your domain is not approved by DocSearch

If you see a message like "Your domain was not approved for DocSearch", the UI
integration in this repository is still valid, but the **DocSearch-hosted
crawler** cannot be used for that domain.

Use one of these options:

1. Re-apply after confirming your production domain is publicly accessible and
	contains crawlable content.
2. Use your own Algolia crawler/index and set `DOCSEARCH_*` variables from that
	index.

Quick checks after configuration:

1. Ensure all three env vars are set.
2. Open devtools and verify no `@docsearch/js` initialization errors appear.
3. Confirm your index has records and the API key is search-only for that index.

### Create your own index in deployment steps

This repository includes a deploy-time index sync flow:

- Script: `scripts/sync_algolia_index.ts`
- Workflow: `.github/workflows/algolia-index.yml`

What it does:

1. Reads local markdown posts.
2. Converts each post into an Algolia record.
3. Clears the target index.
4. Uploads all records in batches.

Required GitHub secrets/variables:

```text
Secrets:
	ALGOLIA_APP_ID
	ALGOLIA_ADMIN_API_KEY
	DOCSEARCH_INDEX_NAME

Variables:
	SITE_URL=https://9renpoto.win
```

Run locally:

```bash
ALGOLIA_APP_ID=... \
ALGOLIA_ADMIN_API_KEY=... \
DOCSEARCH_INDEX_NAME=... \
SITE_URL=https://9renpoto.win \
deno task algolia:sync
```

Dry-run (no write):

```bash
ALGOLIA_DRY_RUN=1 deno task algolia:sync
```

After indexing, set runtime env vars for search UI:

```text
DOCSEARCH_APP_ID=<ALGOLIA_APP_ID>
DOCSEARCH_API_KEY=<search-only API key>
DOCSEARCH_INDEX_NAME=<same index name>
```

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)
