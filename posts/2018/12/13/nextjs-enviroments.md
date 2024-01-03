---
date: '2018-12-13T18:00:00+09:00'
permalink: '/entry/2018/12/13/nextjs-enviroments/'
title: next.js で `process.env` 以下の環境変数を参照する
category: react
---

# TL;DR

- `next/config` をとりあえず使う

## `webpack.DefinePlugin` を使う

- refs: <https://github.com/vercel/next.js/issues/3605>
- なれてるし使いたい。わかる
- イマイチ推奨されてないようで、
  [複数のサンプルが紹介されている](https://github.com/vercel/next.js/issues/3605#issuecomment-359512586)

## `babel-plugin-transform-define` を使う

- refs:
  <https://github.com/vercel/next.js/tree/deprecated-main/examples/with-universal-configuration-build-time>
- babel7に対応してない（2018/12
  現在）。[PR はあるけれど放置されている](https://github.com/FormidableLabs/babel-plugin-transform-define/pull/49)

## `dotenv-webpack` を使う

- refs: <https://github.com/zeit/next.js/tree/canary/examples/with-dotenv>
- dockerの下りで `.envrc` ではなく `.env` を利用するプロダクトが増えた
- よしなに展開してくれる

## 標準で用意されている仕組みを使う

- refs
  - <https://spectrum.chat/next-js/general/runtime-configs-with-process-env~55b503c2-07f4-4da3-9ba4-287733b3d622>
  - <https://github.com/vercel/next.js#exposing-configuration-to-the-server--client-side>
- clientでは配信したくない環境変数とか確かにある
- 面倒だけれど別々に宣言的管理する
