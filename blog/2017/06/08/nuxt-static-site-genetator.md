---
date: '2017-06-08T22:22:18+09:00'
permalink: '/entry/2017/06/08/nuxt-static-site-genetator/'
title: nuxt static site genetator
category: vuejs
---

# TL;DR

- SSR かと思ったら静的サイトも生成できる時代
- 良い素振り環境であれば進んで移行

## gatsby

<https://www.staticgen.com/gatsby>

- React ベースで、ブログやドキュメントのような静的サイトを生成出来るツールとして様子を見ていた
- webpack v1 系の依存が取れなていない
  - webpack v3-rc が来てしまったことを考えると厳しそう
  - @storybook/react の苦い経験
- Router の素振り環境として魅力的だったものの尻込みしていた

## nuxt.js

<https://www.staticgen.com/nuxt>

- inspired by next.js なライブラリ
- 存在は知っていたがまさか静的サイト生成が可能らしい
  - staticgen.com 参照して気づく
- 触ってみる価値はあると判断
- RSS などブログっぽいものはない可能性

## next.js

- next.js も同様に可能？
  - <https://github.com/zeit/next.js/issues/604>
- 普段は React を触っていることが多いため可能ならこちらから
