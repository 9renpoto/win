---
title: 'riak meetup tokyo 2 に参加してきました'
date: '2013-07-10'
permalink: '/entry/2013/07/10/riak-meetup-tokyo/'
categories:
  - 'erlang'
---

# riak meetup tokyo 2 memo

## RTB and FreakOut

RTB概略。

- ディスプレー広告の新しい見せ方
  - 1回の広告表示ごとに買い付け
  - オークション形式によりアラカルトメニュー

広告主のネット広告におけるROI最適を目指す。

RTBの技術的課題。

### 広告表示の時間は0.1秒

- レイテンシの軽減
- 多数のRTBを処理
- 50mc or die

### [Tokoy|Kyoto][tyrant|tycoon]

- 高速
- スケールは簡単にできない
- 運用実績はあるが用件を満たすのが難しい

## Riak and FreakOut

- スループットを向上させるために
  - hashからpartitionを特定する
  - 素のままでは50mc or die的に厳しいため
  - 構成の工夫が必要
  - スケーラビリティの問題を克服できるメリットは大きい
  - 「サーバーを足すだけで運用」

### Yokozuna日本語検索を評価しました

@rev4t @yosisa

日本語検索： Yokozuna。

Solr XMLスキーマを利用した検索が可能
便利そう。
