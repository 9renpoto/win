---
date: '2016-09-16T19:29:30+09:00'
permalink: '/entry/2016/09/16/frontend-meetup/'
title: Frontend Meetup 01 参加メモ
---

# Frontend Meeup \#1

<https://connpass.com/event/38112/>

## React/Redux で快適フロントエンドライフ（仮）

by @takayuki_shmz (株式会社 FiNC)

<https://tech.nikkeibp.co.jp/it/atcl/column/16/050900104/051000005/>

- React & Redux
  - 学習コスト
  - JSX(うんじゃら）
- 後悔したこと
  - つらいコンポーネント
  - つらい繰り返し・テスト
  - つらいデータの扱い
- 最初に抑えるべき
  - 正しいコンポーネント思考
    - smart component
      - dumb コンポーネントと action, store を繋ぐ
    - dumb component
- Stateless コンポーネントが原則
  - case by case だけども
- css はコンポーネントと 1v1
- this.contents
  - <https://reactjs.org/docs/context.html>
  - API 層を context に渡し container を呼ぶ

## 革命と秩序と SPA(React、flux、flowtype)

by @joe_re (freee 株式会社）

<https://speakerdeck.com/joere/ge-ming-tozhi-xu-tospa>

- backone
- freee-mvc-framework
- vue
  - mvvm
- react & flux
  - single-state を途中から導入するのがツラい
  - flux-utils
    - サポートの範囲が小さい分外しやすい
- flowtype

## Angular と心中する（仮）

by @Quramy (株式会社 WACUL)

<https://quramy.github.io/spa-knowhow-note/#/>

- WACUL
  - TypeScript
  - angular 1.x
- Angular 1.x
  - component
  - コードの自動生成
  - エラー周り
- style 管理問題
  - BEM
  - component:css = 1:1
  - <https://github.com/ukyo/angular-simple-bem>
- Rollbar
  - 裏で sourcemap 連携

##　コンテンツ配信と SPA。

by @konpyu (Piece of cake,Inc)

- note <https://note.mu/>
  - angular 1.3
  - mobile 遅い
- Drupal8
- SSR
- HTTP2

## SPA と覚悟

by @teppeis (サイボウズ）

- SPA
  - ブラウザーにとっては 1 枚のページに見えている
  - ブラウザーの体験を超える覚悟がある
- 初回ロード
- a11y
- ブラウザーを越えすぎても駄目

## Angular2 でつまづいたところ（仮）

by @nacika_ins

## 1px をめぐる戦い

@yoshiko_pg

<https://yoshiko-pg.github.io/slides/20160916-spa/>

## SPA でのセッション管理とセキュリティ

by @uryyyyyyy

- <https://qiita.com/uryyyyyyy/items/9a8276f7241b650f1c15>
- <https://twitter.com/teppeis/status/776757447813771265>
