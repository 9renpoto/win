---
date: '2016-01-13T22:29:22+09:00'
title: Update Blog
permalink: '/entry/2016/01/13/gh-pages/'
categories:
  - 'github'
---

# TL;DR

- Hugo を利用して `<username>.github.io` に公開
- [mozilla/oghliner](https://github.com/mozilla/oghliner)を利用してオフライン対応

## Hugo を利用して gh-pages にデプロイ

公式ドキュメントで wercker-ci を利用したデプロイ方法が[紹介](https://gohugo.io/hosting-and-deployment/deployment-with-wercker/)されており、そちらを利用していましたが。

```shell
http://9renpoto.github.io/<project_name>
```

という名前になってしまい、個人ページとして構築を目的とした場合不満があったため環境を見直し。

- [pages.github.com/](https://pages.github.com/)
- [qiita.com/eichann/items/4fe61b8b9bbafcfbe847](https://qiita.com/eichann/items/4fe61b8b9bbafcfbe847#%E3%83%AA%E3%83%9D%E3%82%B8%E3%83%88%E3%83%AA%E3%82%922%E3%81%A4%E4%BD%9C%E6%88%90)

を参考に問題を解決するために手を動かし始めました。

```shell
<username>.github.io
```

リポジトリーを作成し `master` ブランチに push されることによって公開される（not gh-pages branch)ようなので。

`public/` に生成されたものを `<username>.github.io` に dest するように修正しました。

## オフライン対応

[mozilla/oghliner](https://github.com/mozilla/oghliner)が serviceWorker を利用したオフライン化を簡単に提供していたので試しに使ってみる。

## Feature

ビルド・デプロイタスクを直す。
