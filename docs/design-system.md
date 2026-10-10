# Plain CSS and Figma handoff

## Sources

- [Design tokens](../static/design-tokens.css): shared colors, fonts, spacing,
  sizes, radii, shadows, and graph theme values.
- [Component styles](../static/styles.css): semantic classes, layout, Markdown
  typography, responsive behavior, and interactive states.
- [HTML shell](../src/app.html): loads /styles.css, which imports the tokens.
- Svelte components: markup, interaction, and classes such as site-header,
  post-search, article-content, and graph-view.

These CSS files are authored sources. No utility generator or CSS framework is
required. Biome formats and lints both files. Use standard CSS properties and
custom properties when applying a design.

## Variable mapping

The table is a naming convention for a Figma handoff. It does not imply that
a Figma file or automatic synchronization is configured.

| Figma variable or style | CSS token | Default |
| --- | --- | --- |
| color/surface | --color-surface | #ffffff |
| color/text | --color-text | #111827 |
| color/text-muted | --color-text-muted | #6b7280 |
| color/link | --color-link | #0369a1 |
| space/4 | --space-4 | 1rem / 16px |
| space/8 | --space-8 | 2rem / 32px |
| type/body/size | --font-size-body | 1rem / 16px |
| type/title/size | --font-size-title | 1.5rem / 24px |
| type/body/line-height | --line-height-body | 1.5 |
| radius/large | --radius-large | 0.75rem / 12px |
| layout/content-width | --layout-content-width | 64rem / 1024px |
| graph/background/dark | --graph-background-dark | #090d16 |
| graph/background/light | --graph-background-light | #f8fafc |

Pixel equivalents assume a 16px browser root size. Typography and spacing use
rem so browser text size preferences can scale them. Use Figma color variables,
number variables, and text styles for the corresponding values.

Graph panels use data-theme to switch dark/light CSS variables. Canvas drawing
also reads the shared graph color tokens and body font from CSS when the view
mounts. Reload or leave/reopen the graph after changing these tokens. Node and
edge geometry is defined in src/lib/browser/graph.ts.

## Applying a Figma design

1. Map shared design variables to design-tokens.css.
2. Map component names to semantic classes in styles.css.
3. Translate Auto Layout direction, gap, padding, alignment, and sizing to
   flex/grid properties. Keep Svelte markup changes with the component.
4. Define hover, focus-visible, selected, disabled, error, and empty states.
5. Compare mobile and desktop screenshots with the Figma frames.

The tablet breakpoint is 48rem (normally 768px), and the desktop article sidebar
breakpoint is 64rem (normally 1024px). Media query values are written directly
in styles.css because ordinary CSS custom properties cannot be used as
media query conditions.

## Local checks

Run npm run check:biome and npm run check after changes. Run npm run test:browser
to build the Cloudflare target and execute node:test browser checks against
fresh development and production preview servers. Playwright supplies Chromium
automation. Screenshots of Home, About, and graph themes are written to
test-results/ for desktop and mobile.

<details>
<summary>日本語</summary>

## CSS の構成

色・フォント・余白・寸法・角丸・影・グラフのテーマ値を
[design-tokens.css](../static/design-tokens.css)、画面と部品のスタイルを
[styles.css](../static/styles.css) にまとめています。
[src/app.html](../src/app.html) が /styles.css を読み、そこからトークンを import します。
両方とも編集対象のソースで、Biome の format・lint 対象です。

Svelte 側は site-header、post-search、article-content、graph-view など、
役割が分かるクラス名を使用します。Tailwind や CSS フレームワークは不要です。

## Figma との対応

上の表は Figma から実装へ渡すための命名ルールです。
Figma ファイルとの接続や自動同期は設定していません。

Figma の color/surface は --color-surface、space/4 は --space-4、
type/body/size は --font-size-body のように対応させます。
色は Color variables、寸法は Number variables、文字は Text styles で管理します。
表の px 換算はブラウザーの基準文字サイズが16pxの場合です。
実装では rem を使い、ブラウザーの文字サイズ設定に追従させます。

グラフのパネルは data-theme と CSS 変数でテーマを切り替えます。
canvas の色とフォントも表示開始時に共通の CSS トークンから読みます。
トークン変更後は再読み込み、または別ページからグラフを開き直します。
ノード・線の形状は src/lib/browser/graph.ts に定義しています。

## デザインの反映手順

1. 共通変数を design-tokens.css に対応させます。
2. 部品名と styles.css のクラス名を対応させます。
3. Auto Layout の方向・gap・padding・整列・寸法を flex/grid に置き換えます。
   マークアップの変更は対応する Svelte 部品に置きます。
4. hover・focus-visible・selected・disabled・error・空の表示を指定します。
5. モバイル・デスクトップのスクリーンショットを Figma の画面と比較します。

タブレットの切り替えは48rem（通常768px）、記事の目次サイドバーは64rem（通常1024px）です。
通常の CSS 変数は media query の条件に使えないため、styles.css に数値を直接記述します。

## 確認

npm run check:biome と npm run check を実行します。
npm run test:browser は Cloudflare 向けビルド後、開発・本番プレビューの
新規サーバーに対して node:test でブラウザー確認を実行します。
Playwright は Chromium の操作に使用します。
Home・About・グラフの両テーマのデスクトップ／モバイル画像を test-results/ に出力します。

</details>
