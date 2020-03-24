---
date: '2017-06-25T13:40:18+09:00'
permalink: '/entry/2017/06/25/nyc-typescript-coverage/'
title: TypeScript で coverage を計測する方法を変える
category: 'js'
---

# TL;DR

- nyc が公式でサポート
- 事前の tsc して remap-istanbul しなくても良くなりました（後述）

## Usage

- [公式ドキュメント][tutorial-typescript]をそのまま記述
- <https://github.com/9renpoto/ts/pull/93>

## メリット

- 前回：<https://9renpoto.dev/2016/08/20/typescript-coverage/>
- tsc する一手間を省略して`ts-node`に任せるだけでよくなりました

## Refs

- [公式ドキュメント][tutorial-typescript]

[tutorial-typescript]: https://istanbul.js.org/docs/tutorials/typescript/
