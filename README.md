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

## Algolia search

This site uses Algolia search.

1. Create or choose an Algolia index.
2. Generate a search-only API key.
3. Set runtime credentials.
4. Start the app with `deno task start`.

Runtime environment variables:

```text
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_API_KEY=...
ALGOLIA_INDEX_NAME=...
```

When all three variables are present, a search box is rendered in the header. If
they are missing, the UI stays hidden.

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
	ALGOLIA_INDEX_NAME

Variables:
	SITE_URL=https://9renpoto.win
```

Run locally:

```bash
ALGOLIA_APP_ID=... \
ALGOLIA_ADMIN_API_KEY=... \
ALGOLIA_INDEX_NAME=... \
SITE_URL=https://9renpoto.win \
deno task algolia:sync
```

Dry-run (no write):

```bash
ALGOLIA_DRY_RUN=1 deno task algolia:sync
```

After indexing, set runtime env vars for search UI:

```text
ALGOLIA_APP_ID=<ALGOLIA_APP_ID>
ALGOLIA_SEARCH_API_KEY=<search-only API key>
ALGOLIA_INDEX_NAME=<same index name>
```

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)
