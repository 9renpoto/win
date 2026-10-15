# Cloudflare deployment

The Node workflow deploys Worker `win` after its `test` job succeeds on main.
Pull requests only run checks. A manual run of the Node workflow on main also
runs checks before deployment. Deployments are serialized; a queued run fails
before publishing if its commit is no longer the current main commit.
An already running deployment can finish while a newer commit is being tested.
The concurrency group uses `queue: max` so an older commit finishing tests late
cannot replace a newer pending deployment. Up to 100 jobs can wait; additional
jobs are canceled if the queue is full. Stale queued commits fail the main SHA
check before publication, leaving the current main job eligible to deploy.

## Initial setup

1. Configure the Cloudflare account's workers.dev subdomain. Start with the
   `win` Worker on workers.dev; retain the existing Deno deployment and DNS.
   Do not also enable Workers Builds Git deployment for this Worker.
2. Create a Cloudflare API token with Workers Scripts Edit permission scoped
   to the target account. No zone permission is needed for this initial
   workers.dev deployment. Store it as `CLOUDFLARE_API_TOKEN` in the GitHub
   `production` Environment's secrets.
3. Restrict the `production` Environment to the main branch. Set its variables
   `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_DEPLOY_URL` (the HTTPS workers.dev
   origin, without a path). Leave required reviewers unset for automatic
   deployment after merge; enabling them adds a manual publication gate.
4. Set optional runtime variables on the Worker: `SITE_URL`, `ALGOLIA_APP_ID`,
   `ALGOLIA_SEARCH_API_KEY`, `ALGOLIA_INDEX_NAME`, and `GA4_MEASUREMENT_ID`.
   Deployment uses `--keep-vars` to preserve dashboard-managed variables.
   Never put `ALGOLIA_ADMIN_API_KEY` in the Worker or deployment job.
5. After this workflow is on main and configuration is ready, set the repository
   Actions variable `CLOUDFLARE_DEPLOY_ENABLED` to `true`. Run the Node workflow
   manually on main for the first deployment. Subsequent main pushes deploy
   automatically after the test job passes. Disable this variable to stop
   future deployments; it does not stop a job already running.

The deploy job uses Node 24 and npm ci to rebuild the same commit checked by
the test job. The npm Wrangler dependency remains required by the Cloudflare
adapter for development and builds. Publication uses the SHA-pinned official
Wrangler Action with `wranglerVersion: "latest"`; the action installs the current
Wrangler release instead of reusing the lockfile's version. Future major
releases are included. Specifying `"4"` would reuse an installed Wrangler 4. An unchanged action
SHA can therefore deploy with a newer Wrangler. The action logs the selected
version for troubleshooting. There is no local deployment npm script.
Cloudflare credentials are supplied
only to configuration validation and deployment, not the build or PR checks.
The optional octocov reporting job does not gate publication. Separate textlint
and other PR checks should be required by main branch protection as appropriate;
the deployment job itself waits for the Node test job only.

## Verification and cutover

The workflow checks HTTP success for `/healthz`, `/`, and `/about` after upload.
These checks establish reachability, not the identity of the deployed version.
Confirm the deployment commit/version in Cloudflare and manually check an
existing article URL, assets, RSS, sitemap, missing-page status, and search.
Check optional Algolia and GA4 integrations separately.

Algolia indexing remains in its existing independent workflow. It is not
transactional with deployment. Keep local search for the initial rollout if
index readiness has not been verified; configure a search-only key after the
index is ready. Avoid changing the existing production index during validation.

Move the custom domain only after workers.dev verification. Record the existing
DNS and Deno settings first, then configure the custom domain in Cloudflare and
update `SITE_URL` and `CLOUDFLARE_DEPLOY_URL`. Domain cutover is a separate step.
If a smoke check fails, the job fails after publication; it does not automatically
restore the prior version. Disable deployments and use Cloudflare's deployment
history to roll back to a known good Worker version. Keep Deno available until
the custom domain has been verified.

References: [GitHub Actions deployment](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/),
[Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/).

<details>
<summary>日本語</summary>

Node workflow は main の test job 成功後に Worker `win` を公開します。
PR は検証のみ実行し、main での手動実行でも検証後に公開します。
公開 job は直列化し、待機中に main が進んだ場合は古いコミットの公開を失敗させます。
実行中の公開は、新しいコミットの検証中でも完了する場合があります。
concurrency group に `queue: max` を設定し、検証が遅く終わった古いコミットが
待機中の新しい公開を置き換えないようにします。最大100件まで待機でき、上限を超えた
job は取り消されます。古いコミットは公開前の main SHA 確認で失敗し、
現在の main の job は公開可能な状態で残ります。

初回は既存 Deno と DNS を維持し、workers.dev で確認します。
Cloudflare の workers.dev サブドメインを設定し、同じ Worker の Workers Builds による
Git 自動公開は有効にしません。
対象アカウントの Workers Scripts Edit 権限を持つ API token を作成し、
GitHub の production Environment の Secret `CLOUDFLARE_API_TOKEN` に保存します。
初期の workers.dev 公開に Zone 権限は不要です。
Environment は main に限定し、Variables に `CLOUDFLARE_ACCOUNT_ID` と
`CLOUDFLARE_DEPLOY_URL`（パスなしの HTTPS origin）を設定します。
自動公開する場合は必須 reviewer を設定せず、設定する場合は公開前の手動承認になります。

任意の実行時設定は Worker 側の `SITE_URL`、`ALGOLIA_APP_ID`、
`ALGOLIA_SEARCH_API_KEY`、`ALGOLIA_INDEX_NAME`、`GA4_MEASUREMENT_ID` に設定します。
`--keep-vars` でダッシュボードの変数を保持します。
Algolia 管理キーを Worker や公開 job に渡してはいけません。

workflow が main に入って設定が完了したら、リポジトリの Actions Variable
`CLOUDFLARE_DEPLOY_ENABLED` を `true` にし、main の Node workflow を手動実行します。
以後は main への push と検証成功で自動公開します。この変数を無効にすると以後の
公開は停止しますが、実行中の job は停止しません。
公開 job は Node 24 と npm ci で検証と同じコミットを再ビルドします。
npm の Wrangler 依存は Cloudflare adapter の開発・ビルド要件として残します。
公開には SHA 固定の公式 Wrangler Action と `wranglerVersion: "latest"` を使い、
lockfile とは別に現在の Wrangler を導入します。将来のメジャー更新も対象です。
`"4"` を指定すると、インストール済みの Wrangler 4 が再利用されます。そのため、Action の SHA が同じでも
公開用 Wrangler が更新されます。選択されたバージョンは Action のログで確認できます。
ローカル公開用の npm script は設けません。
Cloudflare 認証情報は設定確認と公開だけに渡し、ビルドと PR 検証には渡しません。
octocov は公開の条件に含めません。公開が待つのは Node の test job のみです。
独立した textlint などは必要に応じて main の必須 PR チェックに設定します。

公開後に `/healthz`、`/`、`/about` の HTTP 成功を確認します。
この確認だけでは公開バージョンを特定できないため、Cloudflare 側でコミットと
バージョンを確認し、既存記事、アセット、RSS、サイトマップ、404、検索も確認します。
Algolia と GA4 の実サービス確認は別に行います。
Algolia 同期は既存の独立 workflow で動き、公開と一体ではありません。
初回は必要に応じてローカル検索を使用し、インデックスの準備後に検索専用キーを設定します。
検証のために既存本番インデックスを変更しないでください。

独自ドメインは workers.dev の確認後に切り替えます。既存 DNS と Deno 設定を記録し、
Cloudflare のドメイン設定後に `SITE_URL` と `CLOUDFLARE_DEPLOY_URL` を更新します。
疎通確認が失敗しても公開は自動で元に戻りません。自動公開を無効にし、Cloudflare の
履歴から正常な Worker バージョンに戻します。独自ドメイン確認まで Deno を維持します。

</details>
