---
date: '2016-08-20T14:28:25+09:00'
permalink: '/entry/2016/08/20/typescript-coverage/'
title: TypeScript で coverage を計測する
category: 'js'
---

# TypeScript で Coverage report を計測する

## TL;DR

- [remap-istanbul](https://www.npmjs.com/package/remap-istanbul) を使う

## Usage

- `npm install remap-istanbul`
- `sourcemap: true`

## Memo

- `tsc` > `npm test` という流れになったためJavaScript としてテストをする形になる
- [espower-typescript](https://www.npmjs.com/package/espower-typescript)
  を使わないようになる
  - `espower-typescript` はtscのwrapperなのでtscする場合は使えなそう
- `power-assert` が上手く構造を解釈してくれてなさそう
  - `espower-typescript` が担っていた役割を別で与える必要がある
  - TypeScriptに依存するなら無駄にbabel pluginなどは使いたくない
    - TODO考える

## Refs

- <http://blog.syati.info/post/typescript_coverage/>
- <https://github.com/9renpoto/ts/pull/34>
