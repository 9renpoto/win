---
date: '2017-06-05T11:08:23+09:00'
permalink: '/entry/2017/06/05/i18n-webpack/'
title: i18n-webpack-plugin所感
category: 'js'
---

# i18n-webpack-plugin

[i18n-webpack-plugin](https://github.com/webpack-contrib/i18n-webpack-plugin)

## TL;DR

- 必要最低限の機能・サイズになる
- 事前に i18n 後の JS として複数の output とするアプローチ
- できることはシンプル（現状）

## 懸念

- テンプレートエンジンなどで locale 特定が必要？
- `sprintf`のような表現には対応していない
  - 議論中
    [i18n-webpack-plugin/pull/42](https://github.com/webpack-contrib/i18n-webpack-plugin/pull/42)
- 読み込む locale ファイルの生成には関与しない
  - 手動で JSON は作成、メンテナンス

## 現状

- 様子見
- 簡単なサンプルを書いて依存はしておく
