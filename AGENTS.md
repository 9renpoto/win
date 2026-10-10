# Repository Guidelines

## Development and Checks

Use Node.js 24 LTS and npm. CI, .node-version, and package.json target major 24.
Install system developer tools with brew bundle install --file=Brewfile, then
npm ci and prek install -f. Brewfile supplies Biome, prek, and typos-cli. Biome must not be added to npm dependencies or invoked via npx.
The npm scripts invoke the Homebrew-installed biome executable from PATH.
Use lefthook uninstall before prek install -f when migrating an existing checkout.

- `npm run build` / `npm run preview`: Production build and local preview.
- `npm run content:generate`: Compile Markdown, graph, and search data.
- `npm run format` / `npm run format:check`: Biome formatting.
- `npm run lint`: Biome linting.
- `npm run lint:text`: npm-managed textlint for the existing CI year scope.
- `npm run textlint -- <path>`: textlint for explicit Markdown paths.
- `npm run check`: Svelte and TypeScript diagnostics.
- `npm run test:coverage`: Node native coverage with Codecov-compatible LCOV output.
- `npm run test:browser`: node:test with Playwright against fresh development and production preview servers.

npm run check:biome combines formatting, lint, and import checks.
prek.toml defines local system hooks for Biome, npm run check, typos,
and npm-managed textlint.
Run prek run --all-files for maintained files. CI installs tools from Brewfile
and runs the same hooks. typos.toml excludes archived posts, static assets,
lockfiles, and generated output.
Homebrew formula versions roll forward. The Biome schema currently targets
2.5.14; migrate the config when the installed Biome requires a newer schema.
Biome configuration is in biome.json. Full Svelte/HTML support and formatting
are explicitly enabled. Biome does not format Markdown or YAML; retain the
existing documentation style for those files. The search combobox keeps focus on its input using
aria-activedescendant, so only its listbox/option markup is exempted from two
generic interactive-role lint rules.

textlint and its rules are npm devDependencies; do not install them globally.
Keep .textlintrc.json and the established CI year scope unless scope changes
are requested. Dependabot checks npm and GitHub Actions; compatible textlint
updates are grouped, while major updates remain individual.

## Coding and Tests

Use TypeScript, `<script lang="ts">`, Svelte runes, and SvelteKit server loads.
Follow SvelteKit routing and lifecycle conventions. Do not edit generated output.
Keep filesystem I/O in Node build scripts, private configuration in server code,
and browser effects in
client lifecycle hooks with cleanup. Use package imports (`#lib/`) and generated
route types. Prefer small changes and the existing URL and API contracts.

Write plain CSS with semantic component classes and shared custom properties;
do not add Tailwind or utility-class generators. Map Figma variables to the tokens
as described in docs/design-system.md. Use Node standard node:test,
node:assert/strict, and test-context mocks. Playwright is a browser library, not
a test runner. Component tests use svelte/server with the synchronous compile
hook in scripts/register-svelte-tests.ts. Native coverage includes imported
TypeScript modules; compiled Svelte templates are not mapped into LCOV.

Keep pure tests under `__tests__/utils/`, endpoints under `__tests__/routes/`,
Svelte tests named `*.component.test.ts`, and browser checks under
`__tests__/browser/`. Update tests for changed behavior.

## Reviews and Configuration

Use concise conventional commit prefixes. PRs should explain the change, link
issues, include screenshots for UI changes, and identify content/schema changes.
Before requesting review, run formatting, lint, type checks, tests, and the build.
Keep unrelated changes out of commits. Repository documentation is English first
with matching Japanese in a closed `<details>` section.

Do not commit credentials. Developers manage their environment and supply
configuration through process variables or deployment bindings;
consult SECURITY.md.
Algolia admin credentials belong only in the indexing environment; the browser
receives a search-only key. Historical data migration is unnecessary. Likes and
Cloudflare deployment are outside the current local functionality milestone.
