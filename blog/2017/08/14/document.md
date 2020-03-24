---
title: 'ドキュメントの価値'
date: '2017-08-14T22:55:00+09:00'
permalink: '/entry/2017/08/14/document/'
---

# TL;DR

- 本当に必要なのはドキュメントなのか考えましょう

## Living Documentation

- 納得した資料（`client-side-ddd-on-github`）
  - [`良いドキュメントには自動化が必要`](https://github.com/azu/slide/blob/c09ea5254d3633db0cf91199fcaf5adc770c8519/2017/teppeis-sushi/client-side-ddd-on-github.md#living-documentation-1)
  - [`最も良いドキュメントはno document`](https://github.com/azu/slide/blob/c09ea5254d3633db0cf91199fcaf5adc770c8519/2017/teppeis-sushi/client-side-ddd-on-github.md#%E5%AE%88%E3%82%89%E3%82%8C%E3%81%AA%E3%81%84%E3%83%AB%E3%83%BC%E3%83%AB%E3%81%AF%E4%BE%A1%E5%80%A4%E3%81%8C%E3%81%AA%E3%81%84-1)

## リーダブルコード

- [過去ログ](https://9renpoto.dev/2013/02/03/readable-code/)
- [`コメントは領域に対する情報の比率が高くなければならない`](https://gist.github.com/AKB428/b8970cea987577ec93c2#%E7%AC%AC%EF%BC%96%E5%B1%A4-%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AF%E6%AD%A3%E7%A2%BA%E3%81%A7%E7%B0%A1%E6%BD%94%E3%81%AB)

## 自分の考え

- ドキュメントを書くつもりでテストを書く
- Doc Test 不要論
  - 動かせるのでメンテナンスはされている（Good）
  - ソースコードよりも長いテストを書くことは珍しくない
  - ソースの情報が増える、が情報の比重が高いとは限らない
    - それなら綺麗にテストを書く
- ドキュメント生成
  - `JSDoc`, `esdoc`
  - `FlowType`, `TypeScript` の型定義ファイルなどの登場によりその役割は不要になりつつある気持ち
  - ソースコードの情報比率の高まりも重要
    - 可読性
    - 補完
- 動いているものには価値が高い

  - storybook
  - style guide

- 使い始めるための最短ルート

## このエントリーの価値

読まれなければ意味がない。
