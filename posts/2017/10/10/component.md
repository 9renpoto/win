---
title: 'ComponentとContainers'
date: '2017-10-10T22:30:00+09:00'
permalink: '/entry/2017/10/10/component/'
category: 'react'
---

# TL;DR

- React の場合
  - 見た目に必要なものは JSX だけで `Component` である必要はない
  - `Component` はライフサイクルを持つ
  - `Containers` はデータとの関係性を持つ

## Functional Component

- React のドキュメントを読んでいると`React.Component`を extends
  して書く必要があるのかと勘違い
- DOM の定義を書くことは JSX の syntax だけで完結されている
- JSX で書かれたものと CSS を紐付けたもとを **見た目** と記述した場合
  - 見た目はどこのデータに紐付けられるか定かでないため、ライフサイクルを自身で定義するべきではない
  - データを渡して tree を構築するために必要な情報を返すだけでよい
  - <https://github.com/9renpoto/style/pull/228>

## Component

- ライフサイクルと見た目を紐付けることに集中する
- 自分が実現したいライフサイクルを実現できるか考慮して、コンポーネントの大きさを決める

## Containers

- データを紐付けるだけ
- Redux を使った場合、`Component` とは完全に疎結合に定義できる
- ライフサイクルを意識した必要なデータは `Component`
  の中にあるため、素直にデータを紐付ける
- 初期状態の記述には気をつける

## まとめ

- 世界はよく考えられている

![img](https://media.giphy.com/media/RJXHcsfHNtpkY/giphy.gif)
