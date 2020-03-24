---
date: '2015-05-11T22:54:56+09:00'
permalink: '/entry/2015/05/11/create-hugo-theme/'
title: create hugo theme
categories:
  - 'hugo'
---

# TL;DR

- ブログを `octpress` から `hugo` へ移行しました
- [hugo theme](https://github.com/9renpoto/delic) 書きました

## theme を書くために

cmd1 つでテンプレート作成。

```sh
$ hugo new theme foo
.
└── themes
    └── foo
    ├── LICENSE.md
    ├── archetypes
    │   └── default.md
    ├── layouts
    │   ├── _default
    │   │   ├── list.html
    │   │   └── single.html
    │   ├── index.html
    │   └── partials
    │       ├── footer.html
    │       └── header.html
    ├── static
    │   ├── css
    │   └── js
    └── theme.toml
```

[Document](https://gohugo.io/templates/) がよくまとまっていますので参考に。

## TODO

- `layouts/_default` 以外の使い方調べる
- rss 作成
- bower install する build script

## 感想

octpress の時は theme 流用してたので手作りも勉強になりました。

t32k さんの[mol](https://github.com/t32k/mol)を参考（ほぼコピー&ペーストして）に作りました
ありがとうございます。
