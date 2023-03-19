---
title: 'GraphQL: type-graphql so cute 🤗'
date: '2019-10-03T23:00:00+09:00'
categories:
  - graphql
  - nest.js
---

# TL;DR

- [type-graphql](https://github.com/MichalLytek/type-graphql) +
  [typeorm](https://github.com/typeorm/typeorm) で defition
  管理は割とちょうど良さそう
- schema 管理と response interface
  管理はいつも悩ましいがある程度統一的に宣言できる

## Entity と `@ObjectType` を併用してかける

- <https://github.com/9renpoto/frontend/pull/1115>
- 型情報が近いものを記述する形になるが、宣言的に記述でき、かつどちらかだけ必要なものを書き分けられる
- createdAt, updatedAt など共通型を継承して管理できる？
  <https://github.com/9renpoto/frontend/pull/1127>
  - => `@Entity` に見えないと Columns と評価できないため継承することは難しかった
    <https://github.com/9renpoto/frontend/pull/1156>
