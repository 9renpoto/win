---
date: '2016-11-13T09:51:54+09:00'
permalink: '/entry/2016/11/13/nodefest/'
title: nodefest 2016 参加メモ
categories:
  - 'javascript'
  - 'node'
---

# 参加メモ

## Building Interactive npm Command Line Modules

- arguments parsing
  - 200種以上のpackage
- yargs
  - `.help()` 便利
  - Interactiveなオプションを宣言的に記述できる

<https://lrlna.github.io/nodefest-2016/#1>

## Famicom programming with JavaScript

- backgroundの背景を替えるためにはfor-loop4回

## GraphQL for the RESTful crowd

<https://github.com/barakchamo>

- graph QL

  ```js
  user(id: 1) {
    id,
    first_name
    last_name
  }
  ```

- fragment

## The Seif Project

- webの問題はpassword, 簡単に盗まれる
- `Seif Project` の中ではカギ認証
- seifnode
- <https://github.com/paypal/seifnode>
- <https://github.com/paypal/seif-protocol>
- `http://www.seif.place/`

## Why to Standardize your READMEs

- <https://github.com/RichardLitt/standard-readme>

## Vue.js 2.0サーバサイドレンダリング

- レンダラ
- ハイドレーション
- コンテキスト
- バンドリング

サンプル <https://github.com/vuejs/vue-hackernews-2.0>

## React + Reduxを使った大規模商用サービスの開発

1. Transition
   - react-router
     - `onEnter`, 認証認可
     - `replaceState` を使う
1. Code Splitting
   - webpack `require.ensure`
   - <https://github.com/richardscarrott/require-error-handler-webpack-plugin>
1. SSR
   - Reactそのものは別に遅くない
   - Solution
     1. Partial Rendering
        - firstViewだけSSR
   - Composite Rendering

## PostCSS: Build your own CSS processor

- reworkcssが元になっている

## JavaScriptによる並列処理：共有メモリとロック

<https://speakerdeck.com/chikoski/20161113-nodefest>

@chikoski

```js
// 提案中..
window.setImmidiate(() => {
  doTask()
})
```

```js
// 別threadで実行したいjsを指定する
const worker = new Worker('worker.js')
```

`arrayBuffer` はポインタ渡し可能になった => `SharedArrayButter`

```js
// 割り込まれない処理の記述
Atomics
```

```js
Atomics.wake
Atomics.wait
```
