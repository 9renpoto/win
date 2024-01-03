---
date: '2016-09-13T21:38:08+09:00'
permalink: '/entry/2016/09/13/storybook/'
title: storybook を TypeScript で動かす
category: 'react'
---

# React Storybook を試す

## TL;DR

- react-storybookはcomponentのstyleguide
- TypeScriptのままでは動かせないので一度ビルドする（2016/09現在）
- addon拡張で開発が便利になるエコシステムはある
- 途中経過
  - [9renpoto/style](https://github.com/9renpoto/style/tree/aab6f82ccb228a6b56a18223f6f66bf0f3bd78b1)

## storybook

- `stories`
  - `add` して一覧ページがカジュアルに作成できる
  - `gh-pages` などで簡単にホストできる
  - `HMR` ができるのはありがたい
    - いろいろwatchしたくなる
- `webpack` にどっぷり依存

## TypeScript with React

- [2016 年 9 月現在だと React アプリの TypeScript 採用は時期尚早](https://gfx.hatenablog.com/entry/2016/09/12/162055)
  - 確かに現状の型定義は古い
  - まだそこで困るほどReact使いこなせていない
  - 緩く型を信じる・困ったら考える（個人では）
- `tsx`
  - サポートありがたい
  - DOMを型付きで定義できることの安心感
    - テストを書くのは意識高めになる必要がある
  - 便利だけど遅い
- `webpack`
  - 古いloaderが増えてきたex. `ts-loader`
  - `ts-loader` などでwatchはできないので `tsc -w` で様子を見る
  - ガッツリ依存せず疎結合にできるところは疎結合にする

## CSS-module

- 基本的に使わない方が良さそう
- 使う場合は構造化cssとして育てるのではなく、 `local` css
  としてビルドしたほうが良さそう
  - SDKなどで利用するのはアリ

## Refs

[react-storybook を用いた React コンポーネント開発](https://developer.hatenastaff.com/entry/2016/04/14/150000)
