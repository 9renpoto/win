---
title: 'ブログをgatsbyjsで作り直す'
date: '2017-08-11T18:37:00+09:00'
permalink: '/entry/2017/08/11/gatsby/'
category: react
---

# TL;DR

- gatsbyjs でブログを立て直した
- goodbye hugo

## 経緯

- Hugo を使っていたが `Go Template` に勉強要素がなかった
- SPA ベースのブログとして拡張可能なものを探した
- その他に検討したもの
  - nextin
    - next.js ベース
    - css の扱いで苦戦
      - <https://github.com/kriasoft/isomorphic-style-loader>
    - いい加減 `jsx` extension 使わせてくれ
  - nuxt.js
    - React 優先したら後回しに

## 作業内容

<https://github.com/9renpoto/entry>

- <https://github.com/gatsbyjs/gatsby-starter-blog>
  - 不要な依存を削除
  - SSR するために `style-loader` が使えなかったため `static` ファイルを参照するアプローチ
    - <https://www.gatsbyjs.org/docs/importing-assets-into-files/>

![mind](https://media.giphy.com/media/tT0wtdSJvE0Rq/giphy.gif)
