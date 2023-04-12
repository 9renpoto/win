---
title: '複数環境構築のためにLernaを使う、が'
date: '2017-10-02T11:00:00+09:00'
permalink: '/entry/2017/10/02/monorepo/'
category: 'js'
---

# TL;DR

- 期待通りに動かない

## npm or yarn

- npmClient を指定できるようだが、yarn
  を指定すると永遠にインストールが終わらない問題に出くわす
  - <https://travis-ci.org/9renpoto/eslint-config/builds/281805776>
  - `concurrency=1` を指定するなど試すも retry してやっと動く程度
    - 期待する port に接続できていない？
- npm v5
  - 何故か lerna を通してやると `dependencies` が root
    に展開されず見つからない場合がある
  - ディレクトリ直下でやると問題ない場合がある
    - バグっている気持ち

## lerna bootstrap

- 共通 package とは、本当はディレクトリ直下で行いたいができていないようにみえる
  - lerna version 2.2.0
  - 結局複数 install を求められるものがある？
    - eslint
    - typescript
    - flow-bin

## まとめ

- 原因は調べきれていないが、lerna が原因で使えていない問題はいろいろありそう
  - issue は 200 以上ある
- 早めに地雷を踏んでおく

![image](https://3.bp.blogspot.com/-R1W3888HcbU/V9ppr9A_NHI/AAAAAAAA9wE/CuzJ-JfOQz8Ht6w-jNN79_vh6-TeVOGNACLcB/s800/jirai_tanchiki_man.png)
