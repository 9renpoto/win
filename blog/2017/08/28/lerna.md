---
title: 'フロントエンド勉強環境にlernaを使う'
date: '2017-08-26T19:19:00+09:00'
permalink: '/entry/2017/08/28/lerna/'
category: 'js'
---

# TL;DR

- lerna は大きすぎない package を複数管理するときに割りと便利
- lerna で便利なものと、対応していないものがある
  - flow-typed, etc

## Lerna

- babel 等で使われており存在は知っていたが、プラグイン等を管理するような package
  を持っておらず使うつもりはなかった
- greenkeeper に対応していない
  - issue はあがっている
- release コマンドを普段使わない
  - git master commit の発生が気に食わない
  - 素直に publish だけしてほしい
- それでも環境を分ける場合が増えてきたので使ってみる
  - eslintrc
  - babelrc
  - tsconfig

## 入れてみた

- <https://github.com/9renpoto/js>
- <https://github.com/9renpoto/ts>

## 勉強

- 先を見るために今を見る
- 今の何が大事かは、最初はテスト環境だと思っている
  - テストが走る
  - ライブラリ特有のテストがかける
    - jsx,tsx
    - vue
  - カバレッジが取れる
  - 現実的な生産性が見える

![gif](https://media.giphy.com/media/26tPplGWjN0xLybiU/giphy.gif)
