---
title: 'riak meetup tokyo 2 に参加してきました'
date: '2013-07-10'
permalink: '/entry/2013/07/10/riak-meetup-tokyo/'
categories:
  - 'erlang'
---

# riak meetup tokyo 2 memo

## RTB and FreakOut

RTB 概略。

- ディスプレー広告の新しい見せ方
  - 1 回の広告表示ごとに買い付け
  - オークション形式によりアラカルトメニュー

広告主のネット広告における ROI 最適を目指す。

RTB の技術的課題。

### 広告表示の時間は 0.1 秒

- レイテンシの軽減
- 多数の RTB を処理
- 50mc or die

### [Tokoy|Kyoto][tyrant|tycoon]

- 高速
- スケールは簡単にできない
- 運用実績はあるが用件を満たすのが難しい

## Riak and FreakOut

- スループットを向上させるために
  - hash から partition を特定する
  - 素のままでは 50mc or die 的に厳しいため
  - 構成の工夫が必要
  - スケーラビリティの問題を克服できるメリットは大きい
  - 「サーバーを足すだけで運用」

### Yokozuna 日本語検索を評価しました

@rev4t @yosisa

日本語検索： Yokozuna。

Solr XML スキーマを利用した検索が可能 便利そう。
