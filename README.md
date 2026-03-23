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

1. Apply to the DocSearch program and wait for approval.
2. Set the credentials in your environment.
3. Start the app with `deno task start`.

Environment variables:

```
DOCSEARCH_APP_ID=...
DOCSEARCH_API_KEY=...
DOCSEARCH_INDEX_NAME=...
```

When the three variables are present, a search box is rendered in the header. If
they are missing, the UI stays hidden.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)
