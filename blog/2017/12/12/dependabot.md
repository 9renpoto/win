---
title: 'dependabotのすすめ'
date: '2017-12-12T22:53:00+09:00'
permalink: '/entry/2017/12/12/dependabot/'
category: service
---

# TL;DR

- goodbye greenkeeper
- welcome to [dependabot](https://github.com/marketplace/dependabot)

## JavaScript ライブラリを追いかける

- ライブラリ更新サービスは、ライブラリの更新を追いかけるのには必須のサービスだ
- 薄く依存させ CI を回しているだけで簡単に壊れていく
- 無駄に芝生があたたまる

## Greenkeeper との出会いと現状

- 更新が遅くなってきた
- lock ファイルの登場、メンテナンスの必要性がプラス必要に
- org 単位でもイケる

## Dependabot のいいところ

- multi language
- lock ファイルも含めて更新
- コンフリクトは PR の中でサービスが自己解決
- daily,weekly,monthly の簡単な定期更新

## まとめ

- 便利なサービスに引っ越していきたい
