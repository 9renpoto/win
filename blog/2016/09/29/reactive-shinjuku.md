---
date: '2016-09-29T19:02:35+09:00'
permalink: '/entry/2016/09/29/reactive-shinjuku/'
title: 第3回 Reactive System Meetup in 西新宿
---

# 参加メモ

<https://reactive-shinjuku.connpass.com/event/38411/>

ハッシュタグ `#reactive_shinjuku`

## リアクティブ DDD について

株式会社 ChatWork 加藤潤一氏（@j5ik2o）

- リアクティブ DDD
  - リアクティブシステム && ドメイン駆動設計
- Actor は DDD で示されるコンセプトを表現できる
- リアクティブシステムと Akka
- リアクティブ宣言 <https://www.reactivemanifesto.org/>
  - Elastic
  - Responsive
  - Reslilient
  - Message Driven
- ソフトウェアの災いを表す用語
  - 誤差・誤り（error)
  - 欠陥（defect, バグを含む概念）
  - 障害（fault)
  - 故障（failure)
- メッセージ駆動
- Akka
  - 2011 年の記事では Erlang の 2 倍のスループットを発揮した
- ドメインモデル
  - `モデル = 考え方とコードを結びつけたソフトウェア` を実現する
- ドメイン層の隔離

ここからスライドを参照してあとで勉強する。

<https://speakerdeck.com/yoskhdia/modeling-the-domain-event>

## Lagom で学ぶ Reactive Microservices Architecture

株式会社 TIS 根来和輝（@negokaz）

- Reactive Microservices Architecture
- Lagom
  - 非同期・ノンブロッキング API
  - Sharding によるステートフルアーキテクト
  - 分散型の永続化機構
    - CQRS + Event Sroucing
  - Circuit Breaker

www.slideshare.net/negokaz/lagom-reactive-microservices-architecture
