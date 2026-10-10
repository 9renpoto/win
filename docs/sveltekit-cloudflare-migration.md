# SvelteKit and Cloudflare migration plan

Status: local functionality implemented and verified, excluding likes. The previous deployment used
Fresh and Deno Deploy. Production cutover has not occurred.

## Agreed scope

- Use Node.js 24 and npm for development, generation, builds, scripts, and CI.
  Remove Deno runtime, packages, entry points, configuration, and tooling.
- Use TypeScript throughout SvelteKit and follow its routing, server load,
  component, and lifecycle conventions.
- Install Biome, prek, and typos from Brewfile. Biome has no npm dependency.
  Use system tools in prek hooks and the Node CI workflow.
- Use Biome for formatting/linting, plain CSS with shared design tokens for
  Figma handoff, and standard node:test for all tests. Playwright is only a
  browser automation library.
- First make existing functionality work locally, excluding likes. Like UI,
  /api/likes, and persistence are deferred; they do not block this milestone.
- Preserve article URLs, Markdown content, static assets, and API contracts.
- Do not migrate historical likes or an existing search index. Regenerate
  search records from Git Markdown when configuring the new deployment.

## Feature inventory and implementation map

| Feature             | Target source                                                            | Local acceptance                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home and pagination | src/routes/+page.*, api/posts/+server.ts, PostList.svelte                | Author profile, newest first, initial 10 posts, automatic loading, button, errors, and end of list.                                                                 |
| Articles            | src/routes/entry/[...slug]/, content/markdown.ts, TableOfContents.svelte | Existing paths, front matter, raw HTML, dates, character count, anchors, and nested TOC.                                                                            |
| About, health, 404  | src/routes/about/, healthz/, +error.svelte                               | Existing About Markdown, article count, actual 404 status for missing routes and articles.                                                                          |
| Social embeds       | content/markdown.ts, browser/embeds.ts                                   | X/Bluesky conversion, bounded handle resolution with fallback links, origin/source validated resize messages, and Instagram initialization after client navigation. |
| Graph and API       | src/routes/graph/, api/graph/, content/graph.ts, browser/graph.ts        | Same nodes/edges and link matching; canvas simulation, node navigation, drag/pan, zoom/reset, search, orphans, themes, and cleanup.                                 |
| Search              | Search.svelte, api/search/, content/search.ts                            | Local search without credentials; Algolia autocomplete with search-only configuration; links and keyboard navigation.                                               |
| Index generation    | scripts/sync_algolia_index.ts                                            | Existing slug-based object IDs and record fields, batching, and credential-free dry run.                                                                            |
| RSS                 | src/routes/rss.xml/, server/feed.ts, net.ts                              | All posts and full feed HTML, XML escaping, forwarded domain handling, content type, cache headers; no automatic social embeds in feed HTML.                        |
| SEO and discovery   | SEO.svelte, sitemap.xml/, static/robots.txt                              | Titles, descriptions, Open Graph/Twitter/date metadata, sitemap without health, existing robots and asset paths.                                                    |
| Shared UI and GA4   | +layout.*, components/                                                   | Japanese document language, desktop/mobile navigation, icons, profile, footer, plain CSS and design tokens, optional GA4 with client navigation.                               |
| Likes               | Deferred                                                                 | No API, buttons, storage, or data migration in this milestone.                                                                                                      |

Paths in the table are relative to src/lib/ or src/routes/ where appropriate.
The current source contains 158 articles and 21 static files; checks compare
generated content with source files instead of relying on a fixed count.

## Architecture

SvelteKit renders pages on the server and hydrates Svelte components for
interaction. Page data is loaded in typed server load functions. Interactive
components use Svelte runes and clean up observers, fetches, event listeners,
and graph animation when navigating away.

Node scripts traverse Markdown using node:fs/promises, parse YAML front matter,
and use marked to produce article HTML, feed HTML, heading metadata, graph
data, and search records. A generated JSON manifest lives under
src/lib/server/generated/ and is ignored by Git. Runtime requests read that
bundle; they do not read repository files.

Vite generates content before development/build and watches Markdown changes
during development. npm scripts invoke Biome, Svelte diagnostics,
node:test, Playwright browser automation, and Algolia sync. The Node CI workflow
publishes LCOV coverage to Codecov. Plain CSS and shared tokens are documented
in [the design guide](design-system.md). textlint and its rules are npm
devDependencies, with the existing rules/year scope retained in CI and prek.
The devcontainer uses a pinned Node.js 24 image directly; its custom Dockerfile
and global npm installs are removed. Dependabot checks npm and GitHub Actions
weekly, groups compatible textlint updates, and keeps major updates separate.

The Cloudflare adapter is configured in vite.config.ts and Workers output in
wrangler.jsonc. No database binding is needed for the current milestone.
Generated framework output is not edited.

Private runtime variables are defined in src/env.ts and read in server code.
The layout exposes only Algolia search configuration and an optional GA4 ID;
the indexing admin key stays in the Node script environment. Without Algolia
configuration, search uses generated local records. GA4 is disabled in
development and absent when no measurement ID is set.

## Local verification

1. Install developer tools with brew bundle install --file=Brewfile, then
   install from the npm lockfile using Node.js 24. Install Git hooks with prek.
2. Generate all source slugs and About; compare Markdown, order, graph endpoints,
   search records, heading behavior, and feed encoding with node:test.
3. Run formatting, lint, and Svelte/TypeScript diagnostics.
4. Build the Cloudflare target and serve the production output locally.
5. Use node:test with the Playwright library on desktop and mobile to check
   all article URLs, feeds, assets, 404s, pagination, search/navigation,
   graph controls, and the menu.
6. Run Algolia sync in dry-run mode without credentials. Do not update a live
   index as part of local validation.
7. Confirm active source, scripts, dependencies, CI, and hooks do not require
   Deno. Historical article text can still mention it.

Local verification does not establish remote CI, real Algolia indexing, social
provider availability, analytics delivery, or a deployed Worker.

## Verification record (October 10, 2026)

- After removing Tailwind and Vitest, Node.js 24.21.0 passed 37 native node:test
  unit/component tests with Node coverage and LCOV output.
- Component tests compile Svelte for server rendering through a synchronous
  Node module hook. The LCOV report covers imported TypeScript modules, not
  generated Svelte template code or browser-executed bundles.
- Biome checks both authored CSS files, TypeScript, and Svelte; diagnostics
  reported zero errors and warnings. The Cloudflare production build succeeded.
- All 10 native browser tests passed against fresh development and production
  preview servers. Screenshots cover Home, About, and both graph themes.
- After removing the obsolete toolchains, npm audit initially reported no findings.
  Adding the existing textlint rules surfaced six moderate development-dependency
  findings from the JTF style/PRH/sprintf-js chain; no patched sprintf-js release
  is currently available.
- npm-managed textlint passed on all 36 articles in the retained year scope
  using Node.js 24. The textlint/Node workflow files passed actionlint.
- Biome now runs from Homebrew; Brewfile and prek.toml define system tooling.
  The installed Homebrew Biome 2.5.14 is the configuration schema baseline.
- prek 0.5.5 passed all four system hooks (Biome, type checks, typos, textlint).
  On this Intel Mac, the Homebrew build failed; local verification used the
  official release binary with its published SHA-256 verified.
- The desktop/mobile browser suite checks all 158 article URLs, pagination,
  local search, menus, graph controls, and client navigation. A production
  preview uses mocked Algolia and GA4 to check configured search, keyboard
  navigation, page-view events, and private admin credentials.
- Algolia dry run prepared 158 records without writing to an index.
- Remote CI, deployed Cloudflare, real indexing, embed providers, and actual
  analytics delivery have not been verified.

## Remaining release work

- Resolve the JTF style/PRH dependency findings when a compatible fix is available.
  The existing textlint rules remain enabled.
- Review the pinned devcontainer base image manually; there are no Dev Container
  Features or Dockerfile for the removed Dependabot entries to track.

- Choose a later scope for likes. If restored, begin with zero counts and a
  new browser-state namespace; choose and validate storage separately.
- Configure Cloudflare runtime settings and preview deployment.
- Configure search-only credentials and regenerate the selected Algolia index
  from Markdown. Confirm indexing task completion and actual search results.
- Verify external embeds and optional GA4 against their real services.
- Identify the current Deno Deploy project and domain settings before cutover;
  verify the preview, assets, headers, URLs, custom domain, and HTTPS.
- Keep the previous deployment available until the replacement is verified.

<details>
<summary>日本語</summary>

## 方針と現在の対象

旧構成は Fresh と Deno Deploy です。Node.js 24 と npm を開発・ビルド・
スクリプト・CI の基盤にして、Deno 依存を除去します。
SvelteKit 内は TypeScript に統一し、ページ、サーバー load、部品、ライフサイクルは
SvelteKit の慣習に従います。
Biome・prek・typos は Brewfile から導入し、Biome は npm 依存に含めません。
prek の system hook と CI から共通のツールを呼び出します。
format・lint は Biome、スタイルは通常の CSS と共通デザイントークン、
すべてのテスト実行は Node 標準の node:test に統一します。
Playwright はブラウザー操作のライブラリとして利用します。

最初の完了条件は、いいね以外の既存機能がローカルで動くことです。
いいね UI・/api/likes・保存先は後回しにします。既存のいいね数と検索 index の
移行は不要です。記事 URL、Markdown、静的アセット、API の形式を維持します。

## 機能と構成

一覧は公開日の降順・初期10件とし、自動読み込み・ボタン・エラー表示を維持します。
記事は front matter、raw HTML、日付、文字数、見出しと目次を引き継ぎます。
About、記事数の health、404、RSS、サイトマップ、robots、SEO、
プロフィール・フッター・モバイルメニューも対象です。

検索は認証情報なしでローカルの記事データを検索でき、設定時には Algolia を使います。
同期は Git の Markdown からレコードを再生成します。グラフは API とリンク抽出、
canvas の描画、ノード移動・画面移動、拡大縮小・リセット、検索、孤立記事の表示、
テーマ変更、記事への遷移を維持します。X・Bluesky の変換と安全な iframe 高さ調整、
クライアント遷移後の Instagram 初期化、任意の GA4 も対象です。

Node スクリプトで Markdown を読み、YAML と marked を使って記事・feed の HTML、
目次、グラフ、検索データを生成します。生成 JSON はサーバー専用に置き、Git には
登録しません。リクエスト時は生成データを読みます。開発中の Markdown 編集にも追従します。

SvelteKit はサーバー描画と Svelte 部品で実装し、遷移時には通信、observer、
イベント、グラフの描画を片付けます。npm scripts から Biome の format・lint、Svelte の型チェック、
node:test、Playwright によるブラウザー操作、同期を実行します。CI・Codecov・hooks・Dependabot も Node 対応にします。
textlint と各ルールは npm の devDependencies に移し、従来のルール・対象年を維持します。
devcontainer は Node.js 24 の固定イメージを直接使い、独自 Dockerfile と global install を廃止します。
Dependabot は npm と GitHub Actions を週次で確認し、textlint の minor・patch 更新をまとめます。
major 更新は個別に確認します。

Cloudflare 向け adapter と Wrangler 設定を用意します。
現段階ではデータベース binding は不要です。Algolia admin key は同期用の環境に置き、
ブラウザーへは検索用設定だけを渡します。GA4 は開発中には送信しません。

## 確認と残作業

全記事・About・一覧 API・RSS・グラフ・検索データを確認し、format・lint・型チェック、
node:test、デスクトップとモバイルの Playwright によるブラウザー操作、本番ビルド・ローカルプレビュー、
認証情報なしの index 同期 dry run を実施します。
実行用ソース・スクリプト・依存・CI・hooks に Deno 依存を残しません。

Tailwind と Vitest を除去した構成で、Node.js 24.21.0 の node:test による
unit・部品テスト37件が通り、Node 標準の coverage から LCOV を生成しました。
Svelte 部品は同期モジュール hook でサーバー描画用にコンパイルします。
LCOV の対象は読み込まれた TypeScript モジュールです。
生成された Svelte テンプレートやブラウザー上の bundle は含みません。
Biome は共通トークンと画面 CSS の両方を確認し、型チェックはエラー・警告0件でした。
Cloudflare 向けビルドと、新規サーバーからの node:test ブラウザー確認10件も通りました。
Home・About・グラフの両テーマのスクリーンショットを確認しました。
CSS と Figma の対応は [デザインガイド](design-system.md) を参照してください。
デスクトップ・モバイルで全158記事と操作を確認し、本番プレビューでは Algolia と
GA4 をモックして検索・キーボード遷移・page view と admin key の非公開を確認しました。
同期の dry run は158レコードを生成し、外部 index へ書き込んでいません。

Tailwind・typography・autoprefixer・Vitest・専用 Playwright テストランナーを
依存から除去した時点では npm audit は指摘0件でした。
既存の textlint ルールを追加した後は、JTF style・PRH・sprintf-js 経由で
開発依存の moderate 指摘6件があります。sprintf-js の修正版は未公開です。
既存の lint 対象36記事は Node.js 24 の npm 実行で通り、CI 設定も actionlint で確認しました。
対応する修正版の公開後に依存を更新します。devcontainer の固定イメージも別途確認します。
Biome の npm 依存も除去し、Homebrew の2.5.14をスキーマの基準にしています。
Brewfile と prek.toml で system tool の導入・hook を定義します。
prek 0.5.5 の4つの system hook（Biome・型チェック・typos・textlint）は通りました。
この Intel Mac では Homebrew のビルドが失敗したため、公開 SHA-256 と一致する
公式バイナリを使ってローカル確認しています。

ローカル確認と実際の配信確認は別です。いいねの復活、Cloudflare の設定とデプロイ、
Algolia の実同期、外部埋め込み・GA4 の実サービス確認、独自ドメイン切り替えは後続作業です。
切り替え前に既存 Deno Deploy とドメイン設定を特定し、新環境の HTTPS と各 URL の
確認が終わるまで旧デプロイを保持します。

</details>
