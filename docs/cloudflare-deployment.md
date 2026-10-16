# Cloudflare Workers Builds deployment

Cloudflare connects to `9renpoto/win`, builds the SvelteKit application, and
publishes Worker `win` when main changes. GitHub Actions remains responsible
for checks and Algolia indexing; it does not deploy the Worker.

## Connect the repository

In Cloudflare Workers & Pages, create or select Worker `win` and connect the
GitHub repository. Grant the Cloudflare GitHub app access to this repository.
The Worker name must match `name` in wrangler.jsonc. Connecting can trigger an
initial deployment: start on workers.dev and retain the existing Deno deployment
and DNS until verification is complete.

Configure Settings > Builds as follows:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npx --yes wrangler@latest deploy --keep-vars` |
| Non-production builds | Disabled for the initial rollout |

Workers Builds installs dependencies before the build. The repository's
.node-version selects Node 24; verify Node and npm in the initial build log.
Do not use `npm run deploy` as the Cloudflare deploy command: it also builds
and would repeat the configured build command.

Cloudflare manages deployment authentication in Workers Builds. A Cloudflare
API token, account ID, deployment URL, production Environment, or deployment
activation variable does not need to be configured in GitHub for this flow.
Do not enable a second deployment workflow in GitHub Actions.

Main pushes trigger Cloudflare independently of GitHub Actions. Require the
appropriate PR checks in main branch protection before merging; Cloudflare
does not wait for the post-merge GitHub test workflow. Configure branch
protection before enabling automatic production builds. Live branch protection
and Git integration have not been configured by this repository change.

## Runtime variables

Set these on the Worker under Settings > Variables and Secrets, separately
from build variables. `--keep-vars` preserves dashboard-managed variables.

| Variable | Purpose | Initial setup |
| --- | --- | --- |
| `SITE_URL` | Canonical base for sitemap and generated URLs | Set the workers.dev origin initially; update at domain cutover |
| `ALGOLIA_APP_ID` | Algolia application | Optional; leave unset for local search |
| `ALGOLIA_SEARCH_API_KEY` | Browser-visible search-only key | Optional; configure with app ID and index name |
| `ALGOLIA_INDEX_NAME` | Search index | Optional; configure after verifying the index |
| `GA4_MEASUREMENT_ID` | Analytics measurement ID | Optional; leave unset to disable analytics |

Never supply `ALGOLIA_ADMIN_API_KEY` to the Worker or Cloudflare Builds.
It belongs only in the existing GitHub indexing workflow. Indexing and Worker
publication are independent; use local search until index readiness is verified.
Do not change the existing production index merely to validate this deployment.

## Verification and rollback

After the first build, inspect its commit, build log, deployed Worker version,
and workers.dev URL. Check `/healthz`, `/`, `/about`, an existing article,
assets, RSS, sitemap, missing-page status, and search. Optional Algolia and GA4
need separate live checks. No automatic production smoke check is added here.

Move the custom domain only after workers.dev validation. Record existing DNS
and Deno settings, configure the custom domain in Cloudflare, and update
`SITE_URL`. Retain Deno until the domain and HTTPS are verified.
If publication is faulty, stop automatic builds before restoring a known good
version through Cloudflare deployment history. Git rollback and redeployment
are separate from restoring the active Worker version.

Local `npm run deploy` builds and uses `npx --yes wrangler@latest deploy
--keep-vars`. Deployment Wrangler is resolved at execution time, including
future major releases. There is no direct Wrangler version constraint in
package.json; npm still locks the adapter's required Wrangler peer dependency
for development and builds. Local publication requires your own Cloudflare
login or process-provided credentials.

References: [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/),
[build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/),
[production branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/).

<details>
<summary>日本語</summary>

Cloudflare Workers Builds に `9renpoto/win` を接続し、main の変更で Worker `win` を
ビルド・公開します。GitHub Actions は検証と Algolia 同期を担当します。

Workers & Pages で Worker `win` を作成または選択し、GitHub リポジトリを接続します。
Cloudflare GitHub app にこのリポジトリへのアクセスを許可します。
Worker 名は wrangler.jsonc の name と一致させます。接続時に初回公開が動く可能性が
あるため、workers.dev で始め、確認まで既存 Deno と DNS を維持します。

Settings > Builds で本番ブランチを main、ルートをリポジトリ直下、ビルドコマンドを
`npm run build`、公開コマンドを `npx --yes wrangler@latest deploy --keep-vars` にします。
初期段階は本番以外のブランチのビルドを無効にします。
依存はビルド前に導入され、.node-version で Node 24 を選択します。
初回ログで Node と npm を確認してください。Cloudflare の公開コマンドに
`npm run deploy` を指定するとビルドが重複するため、上記の npx コマンドを使います。

公開認証は Cloudflare 内で管理します。GitHub に公開用 API token、Account ID、
公開 URL、production Environment、有効化変数を設定する必要はありません。
GitHub Actions 側に別の公開 workflow を設けないでください。
Cloudflare は main の push で動き、マージ後の GitHub CI 成功は待ちません。
自動公開を有効にする前に main のブランチ保護で必要な PR チェックを必須にします。
この変更では実際のブランチ保護や Git 接続は設定していません。

実行時変数はビルド変数と分け、Worker の Settings > Variables and Secrets に設定します。
`--keep-vars` でダッシュボード管理の変数を保持します。`SITE_URL` は最初に workers.dev の
origin を設定し、独自ドメイン切り替え時に更新します。Algolia は `ALGOLIA_APP_ID`、
検索専用の `ALGOLIA_SEARCH_API_KEY`、`ALGOLIA_INDEX_NAME` をまとめて設定します。
未設定ならローカル検索を使います。`GA4_MEASUREMENT_ID` は任意で、未設定なら計測しません。
管理キー `ALGOLIA_ADMIN_API_KEY` は既存 GitHub 同期 workflow だけに置き、
Worker と Cloudflare Builds に渡してはいけません。同期と公開は独立しているため、
インデックス確認までローカル検索を使い、検証のために既存本番インデックスを変更しません。

初回はコミット、ビルドログ、公開バージョンと workers.dev URL を確認します。
healthz、トップ、About、既存記事、アセット、RSS、サイトマップ、404、検索を確認し、
Algolia と GA4 は別途実サービスで確認します。自動の公開後チェックは追加していません。
workers.dev 確認後、既存 DNS と Deno 設定を記録して独自ドメインを切り替え、
SITE_URL を更新します。ドメインと HTTPS の確認まで Deno を維持します。
問題があれば自動ビルドを停止し、Cloudflare の履歴から正常なバージョンに戻します。
Git の取り消しと再公開は、稼働バージョンを戻す操作とは別です。

ローカルの `npm run deploy` はビルド後に npx 経由で最新の Wrangler を使います。
将来のメジャー更新も含みます。package.json で Wrangler の直接バージョン制約は管理せず、
adapter が必須とする開発・ビルド用 peer dependency だけ npm の lockfile に残ります。
ローカル公開には自身の Cloudflare ログインまたはプロセス経由の認証情報が必要です。

</details>
