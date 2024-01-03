---
date: '2017-06-08T22:22:18+09:00'
permalink: '/entry/2017/06/08/nuxt-static-site-genetator/'
title: nuxt static site genetator
category: vuejs
---

# TL;DR

- SSRかと思ったら静的サイトも生成できる時代
- 良い素振り環境であれば進んで移行

## gatsby

<https://jamstack.org/generators/gatsby/>

- React
  ベースで、ブログやドキュメントのような静的サイトを生成出来るツールとして様子を見ていた
- webpack v1系の依存が取れなていない
  - webpack v3-rcが来てしまったことを考えると厳しそう
  - @storybook/reactの苦い経験
- Routerの素振り環境として魅力的だったものの尻込みしていた

## nuxt.js

<https://jamstack.org/generators/nuxt/>

- inspired by next.jsなライブラリ
- 存在は知っていたがまさか静的サイト生成が可能らしい
  - staticgen.com参照して気づく
- 触ってみる価値はあると判断
- RSSなどブログっぽいものはない可能性

## next.js

- next.jsも同様に可能？
  - <https://github.com/vercel/next.js/issues/604>
- 普段はReactを触っていることが多いため可能ならこちらから
