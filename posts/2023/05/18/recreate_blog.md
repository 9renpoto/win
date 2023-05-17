---
date: '2023-05-18'
title: deno fresh を用いてブログを作り直しました
snippet: gatsyjs からdeno fresh に置き直しました
categories:
  - blog
---

# TL;DR

- <https://www.gatsbyjs.com/> の利用をやめました
- <https://deno.land/x/fresh@1.1.5/init.ts> を用いてブログ基盤を再構築しました

## Why

- gatsbyjsのメジャーバージョンアップに速やかに移行できなかった
  - プラグインの移行が面倒であった
  - ノーコードに近い形で構築ができたが依存の管理が大変であった
  - 静的なサイト構築を仕事で活用するケースが限定されてしまった
- deno fresh
  - preact nativeな利用を推奨していること
  - denoを使った開発環境を構築・保守したかったこと

## 感想

- 開発基盤は発展途上
- 依存は減らすことができた
- プロダクションに利用は難しいが趣味には十分環境が整いつつある
