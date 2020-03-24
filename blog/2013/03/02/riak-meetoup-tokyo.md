---
title: 'riak meetup tokyoに参加してきました'
date: '2013-03-12'
permalink: '/entry/2013/03/02/riak-meetoup-tokyo/'
categories:
  - 'erlang'
---

# Riak intro & RICON 報告

@kuenishi

分散システムの研究や開発は 5 年ぐらい
日本法人が 9 月に出来た。

## Riak の紹介

- Dynamo にインスパイアされた
- Consistent Hassing による水平分割する
- Vector Clocks を用いてレプリケーション
- Erlang/OTP で動作
- 分散 KVS

- HTTP / Protocol Buffers
- Secondary Index/ MapReduce
- Link Walking
- Consistent Hassing and Replicas / Vecteor Clocks

分散システム、ざっくり。

- Graph
- SQL
- Document
- Scale out

## RICON について

- 分散システム、分散 DB のカンファレンス

### 事例

- Redis 側でロックして、裏側は Riak で構築
  - 壊れても大丈夫なようにするのが鉄板のパターン

## 面白かった話

- Rak Pipe
- Introduction Yokozuna
- Building Riak CS on Riak
- Cloning the Cloud
- Bringing Consistency on Riak

## Riak with Engine yard

- EC2 上の Gentoo
- すべては Chef で構築
- その上にアプリをデプロイ
- 再起動も 1 から構築
- ssh / sudo 可能
- 何台、何度でも再現可能

- DB

  - PostgressSQL
  - MySQL
  - Riak

- Riak はバックエンドでたてないとダメ
- Riak Search を使って全文検索が可能
- 今後、Yokozuna に移行予定
