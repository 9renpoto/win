---
date: '2020-02-11T14:00:00+09:00'
title: nest-raven GraphQL support
---

# TL;DR

- <https://github.com/mentos1386/nest-raven/pull/31>
- `@nest/graphql` は `apollo-server` のwrapperで `@nest/common`
  のエラーに対する対応が弱い
- `@nest/graphql` を使いながら一部のAPIを
  [REST](https://docs.nestjs.com/controllers) を用いて表現することはある (ex.
  authorize)

## Service

- `Service` クラス内で扱われる例外が `apollo-server-errors` とは異なる
- 様々な例外をgraphqlでもrestでも評価できる形にする必要がある
- [Exception filters](https://docs.nestjs.com/exception-filters)
  を駆使して例外を整理する？
  - 何れにせよNodeJSの例外処理は貧弱で、無駄にpokemon exception handling
    を作りたくはない
  - エラートラッカー自体がエラー出すと本末転倒

## Refs

- <https://github.com/apollographql/apollo-client/issues/4547>
- <https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-errors>
