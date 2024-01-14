---
date: '2024-01-14'
title: Github Project 十分に機能そろっているのでは
snippet: Project development done exclusively through Github 🐙
---

# TL;DR

- Github Projectの進化がすごい（実はずっとすごかった）
- カスタマイズ性が高く、エンジニアフレンドリー
- フィルタとの組み合わせが強力

## Githubを利用した開発タスク管理

近年、GithubとJIRAを組み合わせたスクラム開発を数年回していた。
理由はGithubでは十分なタスク管理ができないからということで採用されていた。
スクラムやチーム開発の中でタスク管理ツールに求めていたものには下記のような要件があったように考える。

1. カンバン表示ができ、進捗状態を可視化できる
1. カンバン、およびバックログなどに優先度が付けられる（優先度順にソートできる）
1. 複数のチーム、職能が存在していた際にViewを直感的に分けられる（swimlaneなど）
1. エピック・ロードマップが管理でき、簡易的なガントチャートが管理できる
1. ストーリーポイントなど、ベロシティやタスクの大きさを一定入力できる
1. 複数のリポジトリにまたがるタスクを同列に管理できること

チームタスク管理でやりたいこと多すぎるが、これらを十分にカバーできるような機能が揃って来ている。

## Github Projects押しの機能

上記プロジェクト管理に必要な設定がGithub Projectだとどのようにできるのかは[一休Developers Blog](https://user-first.ikyu.co.jp/entry/2023/11/09/175121)の記事がとてもわかりやすい。
大枠はそちらの記事に任せるとして、この記事では私の押しのGithub
Projectの機能を記述する。

### フィルターが強力

Github
はissueやpull-requestの管理、検索などに提供されているフィルターの機能が強力だ。この機能がいい感じ
に[Github Projectでも拡張](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/filtering-projects)され、活用し易いようになっている。

お気に入りのフィルターは下記がある。

- [last-updated:](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/filtering-projects#filtering-for-when-an-item-was-last-updated)
  最近更新されたっぽいのを取ってくる
- [field:](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/filtering-projects#filtering-number-date-and-iteration-fields)
  プロジェクト固有のカスタムフィールドを比較演算使って絞り込み

### Viewを複数持ったプロジェクトを建てられる

> [Changing the layout of a view](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/changing-the-layout-of-a-view)

最初これが１つのプロジェクトという表現の中でなんで分けられる様になってるのだろうとか、このViewはどういうときに使いたくなるのだろうと分からなかった。
結果的にはフィルターと組み合わせることで実際のプロジェクトに合わせ使いやすくカスタマイズ可能な要素だと理解できた。

また、Viewはソートの設定やグローバル設定とローカル設定の管理を別々にできるなどこれまた痒いところに手が届いている。
全体のViewに影響を与えず、手元では `assignee:9renpoto`
などフィルタした状態で膨大なタスクの海を直感的に操作できる。

### プロジェクト（カンバン）を操作しなくてもステータスを更新できる手段が豊富

> [Understanding fields](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields)

Github にはスタンダードな管理方法として `label` と `milestone`
があり、長くこれらの機能の組み合わせで開発プロジェクトの運用ができるようルールを設けたりなどしていた。
これらの標準項目はいずれもリポジトリ固有な設定であり、設定を同期したりそれらの仕組みを組んだりなどが必要であった。

私はずっと [waffle.io](https://github.com/waffleio) というGithub
連携可能なプロジェクト管理ツールが大好きであった。
その中で一番好きだった機能が「ステータスとラベルの連動機能」だ。いい感じにラベルを操作していたら、カンバンもいい感じになる。カンバンを操作していてもGithub
にいい感じのラベルがついている。

# Ref

- [GitHub Projects を利用したタスク管理 | 一休 Developers Blog](https://user-first.ikyu.co.jp/entry/2023/11/09/175121)
- [GitHub Projects を導入した話 | KAKEHASHI Tech Blog](https://kakehashi-dev.hatenablog.com/entry/2023/02/28/090000)
- [Thank you, waffle.io | 9renpoto.win](https://9renpoto.win/entry/2019/05/26/goodbye-waffle-io)
