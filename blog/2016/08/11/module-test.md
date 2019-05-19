---
date: '2016-08-11T21:43:32+09:00'
permalink: '/entry/2016/08/11/module-test/'
title: TypeScript with power-assert
category: js
---

# TypeScriptでpower-assertを使いたい

[TypeScript テストについて](https://9renpoto.github.io/entry/2016/06/23/typescript-module-test/) 少し調べました。

- <https://github.com/9renpoto/ts/pull/31>

## 原因

- TypeScriptがファイルパスを相対パスか絶対パスのどちらかで返す場合がある
  - <https://github.com/Microsoft/TypeScript/blob/204f2c16c0d6ff851e4798c03a9646b625ac2bd7/src/compiler/core.ts#L821-L825>

## 対策

- <https://github.com/teppeis/typescript-simple/pull/47>

## 悩み

- `rootDir`, `outDir` の組み合わせで挙動が変わることを理解する必要がある
- `rootDirs` が入る（TypeScript 2.0~)
