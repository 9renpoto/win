# private blog

[![codecov](https://codecov.io/gh/9renpoto/win/graph/badge.svg?token=m1sd1C4r5f)](https://codecov.io/gh/9renpoto/win)
[![CodeFactor](https://www.codefactor.io/repository/github/9renpoto/win/badge)](https://www.codefactor.io/repository/github/9renpoto/win)

## Usage

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

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

## Dev Container

- Open the folder in VS Code and choose "Reopen in Container" (requires the Dev
  Containers extension).
- The container includes Deno `1.45.x` (kept in sync with `.mise.toml`) and
  forwards port `8000`.
- Once attached, run `deno task start` to launch the Fresh dev server.
