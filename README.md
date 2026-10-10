# Private blog

[![codecov](https://codecov.io/gh/9renpoto/win/graph/badge.svg?token=m1sd1C4r5f)](https://codecov.io/gh/9renpoto/win)

SvelteKit with TypeScript, Node.js 24 LTS, npm, and the Cloudflare Workers adapter.
The current milestone is local functionality excluding likes. Deployment and
historical data migration are outside this milestone.

## Local development

Install the developer tools from [Brewfile](Brewfile), then use Node.js 24 LTS and npm.
Homebrew provides Biome, prek, and typos; Biome is not an npm dependency.
Ensure these executables and Node.js 24 are available on PATH.

```sh
brew bundle install --file=Brewfile
npm ci
prek install -f
npm run dev
```

For existing checkouts with lefthook installed, run lefthook uninstall before
prek install -f. This also removes the old prepare-commit-msg shim. New clones
only need prek install -f.

[prek.toml](prek.toml) runs system Biome, Svelte/TypeScript diagnostics, and typos
using [typos.toml](typos.toml). Run prek run --all-files for all maintained files.
Historical posts and static assets are excluded from spelling checks to preserve
their original text and names. CI installs the same Brewfile and runs these hooks.

Homebrew tracks current formula releases; Brewfile does not pin tool versions.
The Biome configuration targets 2.5.14. When upgrading Homebrew Biome, use
biome migrate --write if the configuration schema needs updating.

Open http://127.0.0.1:5173. Content generation runs before development and builds.
Editing Markdown in posts/ or content/ regenerates the manifest during development.
Generated HTML, graph data, and search records stay in a server-only directory.

```sh
npm run check:biome
npm run check
npm run test:coverage
npx playwright install chromium
npm run test:browser # Includes a production build
npm run build
npm run preview
```

Preview serves the production build at http://127.0.0.1:4173.
The standard node:test runner executes unit, component, and browser tests.
Node coverage writes coverage/lcov.info for imported TypeScript modules.
Playwright is used only as a browser automation library for desktop/mobile checks.
Biome handles formatting and linting for TypeScript, Svelte, HTML, CSS, and JSON.
Use npm run format to apply formatting. Svelte/HTML support is enabled explicitly
in biome.json; Markdown and YAML are currently unsupported by Biome.

Node.js is fixed to the 24 LTS major in .node-version, package.json engines,
and every CI setup step. Minor and patch releases within 24 remain eligible.

## Text linting and dependency updates

textlint and all rules from the former .devcontainer/Dockerfile are npm
devDependencies. npm ci installs them from package-lock.json.
The existing .textlintrc.json rules and CI year selection are retained.

```sh
npm run lint:text
npm run textlint -- posts/2026/01/01/2026-yew-year.md
```

lint:text covers posts from 2021, 2023, 2024, 2025, and 2026. To lint another
file, pass its path to npm run textlint --. The prek textlint hook uses the
same year selection. Historical files outside that selection are not added
to this migration's lint scope.

Development uses the host Node.js and Homebrew tools. No Dev Container
configuration or container image is maintained.

Dependabot checks npm and GitHub Actions weekly. Compatible textlint and
rule updates are grouped; major updates remain separate. Docker and
devcontainers entries are removed along with the container configuration.
The existing patch-only auto-merge workflow remains unchanged.

The migrated JTF style preset brings npm audit's six moderate findings through
textlint-rule-prh, prh, js-yaml, argparse, and sprintf-js. These are development
dependencies. No patched sprintf-js release is currently listed in the
[advisory](https://github.com/advisories/GHSA-hp3w-g68c-fv3c); the existing lint
rules are retained.

## Styles and Figma

Styles are plain CSS with semantic component classes. Edit shared colors, spacing,
typography, and radii in [design-tokens.css](static/design-tokens.css), and layouts
in [styles.css](static/styles.css). The [design guide](docs/design-system.md)
explains how to map Figma variables and layouts to these files.

## Configuration and search

Developers manage their own environment and supply optional configuration
through process environment variables or Cloudflare deployment bindings.
Node scripts read process.env; they do not load an environment file. Without
credentials, the header searches the generated local index through /api/search.

To use Algolia, set ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, and
ALGOLIA_INDEX_NAME. Only the search-only key is sent to the browser. Set
GA4_MEASUREMENT_ID to enable analytics in a production build; development
does not send GA4 page views. SITE_URL controls generated search URLs and the
sitemap; its default is https://9renpoto.win.

Regenerate Algolia records from repository Markdown:

```sh
ALGOLIA_DRY_RUN=1 npm run algolia:sync
```

Dry run needs no credentials and performs no writes. Actual synchronization
clears and repopulates the selected index. It requires ALGOLIA_APP_ID,
ALGOLIA_INDEX_NAME, and ALGOLIA_ADMIN_API_KEY in the script environment.
The [index workflow](.github/workflows/algolia-index.yml) uses GitHub variables
for the app ID, index name, and site URL, and a secret for the admin key.

## Migration and deployment

See the [migration plan](docs/sveltekit-cloudflare-migration.md) for feature
coverage, architecture, and remaining release work. Likes and /api/likes are
currently absent. Existing counts and search indexes will not be copied.

The build generates Cloudflare Workers output using wrangler.jsonc. Production
bindings, deployment, domain cutover, and live service verification remain
separate work. The deployment command is:

```sh
npm run deploy
```

<details>
<summary>日本語</summary>

TypeScript の SvelteKit、Node.js 24 LTS、npm を利用します。
現在の対象は、いいねを除いた既存機能のローカル動作です。

### 開発と確認

[Brewfile](Brewfile) から Biome・prek・typos を導入します。
Biome は npm 依存に含めず、Homebrew の実行ファイルを利用します。
Node.js 24 と各ツールを PATH から実行できるようにします。

```sh
brew bundle install --file=Brewfile
npm ci
prek install -f
npm run dev
```

既存 checkout で lefthook を使っている場合は、prek install -f の前に
lefthook uninstall を実行します。古い prepare-commit-msg の hook も解除されます。
新規 clone は prek install -f だけで設定できます。

[prek.toml](prek.toml) で、PATH 上の Biome、Svelte/TypeScript の型チェック、
[typos.toml](typos.toml) を使う typos を実行します。
全ファイルの確認は prek run --all-files で実行します。
過去の記事と静的アセットは、既存の本文・名前を保持するためスペルチェックから除外します。
CI も同じ Brewfile と hook 設定を利用します。

Homebrew は現行バージョンを導入し、Brewfile ではバージョンを固定しません。
Biome 設定の対象は2.5.14です。brew で Biome を更新した際にスキーマ更新が必要なら
biome migrate --write を実行します。

http://127.0.0.1:5173 を開きます。開発・ビルド前に Markdown から記事、
グラフ、検索データを生成します。開発中の posts/・content/ の編集にも追従します。
生成データはサーバー専用ディレクトリに置きます。

Biome の check:biome と format、Svelte の check、test:coverage、test:browser、build を npm scripts
から実行します。ブラウザー確認の前に npx playwright install chromium が必要です。
npm run preview は本番ビルドを http://127.0.0.1:4173 で表示します。
unit・Svelte 部品・ブラウザー確認はすべて Node 標準の node:test で実行します。
Playwright はブラウザー操作用のライブラリとして使用します。
Node 標準の coverage から、読み込まれた TypeScript モジュールの LCOV を
coverage/lcov.info に出力します。
TypeScript・Svelte・HTML・CSS・JSON の format と lint は Biome に統一します。
biome.json で Svelte/HTML 対応を明示的に有効にしています。
Markdown と YAML は Biome の対応外のため、既存の文書スタイルを維持します。

Node.js は .node-version・package.json の engines・各 CI の setup で24 LTSに固定します。
24の範囲で minor・patch 更新を取り込みます。

### textlint と依存更新

旧 .devcontainer/Dockerfile にあった textlint と各ルールは npm の
devDependencies に移し、npm ci で package-lock.json から導入します。
.textlintrc.json のルールと CI が対象にする年は維持します。

```sh
npm run lint:text
npm run textlint -- posts/2026/01/01/2026-yew-year.md
```

lint:text と prek の対象は2021・2023・2024・2025・2026年の記事です。
他のファイルは npm run textlint -- にパスを渡して確認できます。
対象外の過去の記事は今回の lint 範囲に追加しません。

開発にはホストの Node.js と Homebrew ツールを使います。
Dev Container 設定とコンテナイメージは管理しません。

Dependabot は npm と GitHub Actions を週次で確認します。
textlint とルールの minor・patch 更新をまとめ、major 更新は個別に確認します。
コンテナ設定の削除に合わせて Docker・devcontainers の更新設定も削除します。
既存の patch 更新のみを対象にした自動 merge workflow は維持します。

移行した JTF style preset には textlint-rule-prh・prh・js-yaml・argparse・
sprintf-js 経由で npm audit の moderate 指摘6件があります。開発依存が対象です。
[advisory](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) に修正版が公開されていないため、
現行の lint ルールを維持して残件としています。

### CSS と Figma

Tailwind を使わず、役割が分かるクラス名と通常の CSS で記述します。
色・余白・文字サイズ・角丸は [design-tokens.css](static/design-tokens.css)、
レイアウトは [styles.css](static/styles.css) にまとめています。
Figma の変数・レイアウトとの対応は [デザインガイド](docs/design-system.md) を参照してください。

### 検索と設定

環境の管理は開発者に委ね、任意の設定はプロセスの環境変数、
または Cloudflare の deployment binding から渡します。
Node スクリプトは process.env を読み、環境ファイルの読み込みは行いません。
認証情報がなければ /api/search を使って生成済みの記事データを検索できます。
ALGOLIA_APP_ID、ALGOLIA_SEARCH_API_KEY、ALGOLIA_INDEX_NAME を揃えると
Algolia を使います。admin key はブラウザーへ渡しません。

GA4_MEASUREMENT_ID は本番ビルドで有効になり、開発中は送信しません。
SITE_URL は検索レコードとサイトマップの URL に使用し、
初期値は https://9renpoto.win です。

```sh
ALGOLIA_DRY_RUN=1 npm run algolia:sync
```

dry run は認証情報なしで実行でき、書き込みません。
実際の同期は指定 index を空にして Markdown から再登録します。
スクリプトには app ID、index 名、ALGOLIA_ADMIN_API_KEY が必要です。
GitHub Actions では app ID・index 名・SITE_URL を Variables、
admin key を Secret に設定します。

### 移行範囲

[移行計画](docs/sveltekit-cloudflare-migration.md)に機能と構成をまとめています。
いいね UI と /api/likes は未実装です。既存のいいね数・検索 index の移行は不要です。
Cloudflare 向けのビルド設定は用意していますが、実際のデプロイ、
独自ドメイン切り替え、外部サービスの本番確認は別途行います。

</details>
