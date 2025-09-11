# Repository Guidelines

## Project Structure & Module Organization

- `routes/`: Fresh route handlers and pages. Avoid editing generated files in
  `_fresh/` and `fresh.gen.ts`.
- `components/`: Reusable presentational Preact components (PascalCase, e.g.,
  `Header.tsx`).
- `islands/`: Interactive Preact islands (PascalCase).
- `utils/`: Utilities and domain logic (kebab/snake as present, e.g.,
  `posts.ts`).
- `posts/`: Markdown content and assets.
- `static/`: Public static files.
- `__tests__/`: Test files mirroring feature locations (e.g.,
  `components/TableOfContents.test.tsx`).

## Build, Test, and Development Commands

- `deno task start`: Run dev server with watch.
- `deno task build`: Build the Fresh app for production.
- `deno task preview`: Start the built app locally.
- `deno task test`: Run tests with coverage (writes to `coverage/`).
- `deno fmt` / `deno lint`: Format and lint code; also run via pre-commit.

## Coding Style & Naming Conventions

- Language: TypeScript + Preact JSX (Fresh). JSX runtime is `react-jsx` with
  `preact`.
- Formatting: Use `deno fmt` (no manual style tweaks). Prefer 2-space
  indentation.
- Naming: Components in PascalCase (`Header.tsx`), routes lower-case by path
  (`rss.xml.ts`, `index.tsx`), utilities lower-case (`posts.ts`).
- Imports: Use Deno import maps from `deno.json` (e.g., `@/` root alias,
  `$fresh/`).

## Testing Guidelines

- Framework: Deno test with `@std/testing/bdd` and Fresh Testing Library.
- Location: Place tests under `__tests__/` using `*.test.ts`/`*.test.tsx`.
- Coverage: Ensure `deno task test` passes; CI reports to Codecov. Add tests for
  new components and utilities.

## Commit & Pull Request Guidelines

- Commits: Use concise, conventional prefixes when reasonable: `feat:`, `fix:`,
  `chore:`, `docs:`, `test:`.
- PRs: Include a clear description, linked issues, and screenshots/GIFs for UI
  changes. Note any schema/content migrations.
- Quality gate: Before opening a PR, run `deno fmt`, `deno lint`, and
  `deno task test` locally. Pre-commit hooks also run cspell, hadolint,
  secretlint.

## Security & Configuration Tips

- Do not commit secrets; `secretlint` guards this. Configure environment locally
  (see `SECURITY.md`).
- Avoid editing generated `_fresh/` or `fresh.gen.ts`; update sources instead
  and rebuild.

## Agent-Specific Notes

- Keep changes minimal and scoped; follow existing patterns and directory
  placement.
- Prefer small, reviewable PRs; include test updates and precise rationale.
