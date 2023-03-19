---
date: '2017-05-07T15:39:59+09:00'
permalink: '/entry/2017/05/07/prettier/'
title: prettier 事始め
category: 'js'
---

# prettier

<https://github.com/prettier>

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

`eslint --fix` が最高だと思っていたがまた新たに formatter が出たので依存する。

## eslint-config-prettier

<https://github.com/prettier/eslint-config-prettier>

- 設定
  - <https://github.com/9renpoto/frontend/pull/25>
- 困りごと
  - <https://github.com/standard/eslint-config-standard>
    に依存している（**セミコロン除外**）と現状相性が悪い
  - issue があるようなので今後見直す

## prettier-eslint / prettier-eslint-cli

> Code ➡️ prettier ➡️ eslint --fix ➡️ Formatted Code ✨

<https://github.com/prettier/prettier-atom> に依存して様子を見る。現状若干重い。
**上記セミコロン問題の取りこぼしなどがあり鶏卵になる。**

## TypeScript

- <https://github.com/eslint/typescript-eslint-parser> とは干渉して動かない
- TypeScript の format も計画されているようで期待
