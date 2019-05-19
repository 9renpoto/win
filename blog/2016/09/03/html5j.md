---
date: '2016-09-03T10:02:40+09:00'
permalink: '/entry/2016/09/03/html5j/'
title: '#html5j 参加メモ'
categories:
  - 'html'
  - 'react'
  - 'angular'
---

# html5j

![logo](https://events.html5j.org/conference/2016/9/assets/img/header/logo.svg)

`http://events.html6j.org/conference/2017/10/`

## 基調講演

speaker: 中村修。

大規模分散オペレーティングシステム。

- HDR
- WebはWeb以外に存在するデータ表現を全てできるべき
- 全てinternetの上にある発想
  1. Big Data
  1. AI
  1. IoT
- Distributed Operating System
- 縦書きcss
  - 日本頑張ってる

speaker: 及川卓也。

- IE7担当してました
- アプリケーションとしてのWeb
  - API
  - Web Components
  - PWApps
    - Service Worker
- モバイルデバイスの普及
  - ニュースキュレーションアプリ
  - AMP
    - CMSやツールに依存している場合
- 今こそWebに再投資しよう

## Reactの最新動向とベストプラクティス

speaker: @koba04

- Stateless Function Components(SFC)
- stateはviewに関係あるものだけで十分
- React.PureComponent(v15.3.0~)
  - ShoudComponentUpdateに類似（後で調べる）
- `react-addons-perf`
  - 計測ツール
- React.createClass
  - 徐々に非推奨
  - React.Componentへ
- High Order Function
  - 関数型っぽい
  - `acdlite/recomponse`
- stateの管理
  - なるべく一箇所で管理
  - Redux
    - Container Component
      - 更新処理・状態管理
      - DOMを持たない
    - Presentational Component
      - Viewの構築を担う
- Componentをテストする
  - TestUtil.renderInfoDocument
  - shallowRender
  - `react-test-renderer`
- 開発をサポートするツール
  - <https://github.com/zalmoxisus/redux-devtools-extension>
  - <https://github.com/storybooks/storybook>

## Service Worker Deep Dive

speaker: @horo

slide: <https://docs.google.com/presentation/d/19x3yi7Jn-6In5igGYfEiK0tBfNI290BAclT0AiqDj4Q/pub?slide=id.p>

<https://jakearchibald.github.io/isserviceworkerready/>

- stream
  - <https://docs.google.com/presentation/d/19x3yi7Jn-6In5igGYfEiK0tBfNI290BAclT0AiqDj4Q/pub?slide=id.g1641acac50_0_0>
  - 徐々に読み込んで処理できる
  - `ReadableStream`
- `Unified Media Pipeline (android)`
- Usage
  - `rel=serviceworker`

## The First Step to Angular 2

speaker: @laco0416

- Official Packages
  - `@angular/core`
  - `@angular/forms`
  - `@angular/http`
  - `@angular/router`
- TypeScript
  - 常に正しいAPI
- API
  - `@component`
  - `@input` / `@output`
  - `@directive`
  - `@pipe`
  - `@NgModule`

## Webパフォーマンス最前線

- High Performance Web User Interface
  - パフォーマンスに対する優先度
    - `RAIL` <http://furoshiki.hatenadiary.jp/entry/2015/06/01/122537>
      - Response
      - Animation
      - Idle
      - Loa
  - `transform: translateZ(0)`
    - 凶悪
    - Web標準： `will-change: transform`
      - Reduce GPU Memory
- Scroll Performance
  - `<img lazyload>` :innocent:
  - `intersectionObserver`
  - throttle <https://blog.tsumikiinc.com/article/20141125_javascript-event-throttle.html>
    - TODO調べる
- Task Optimization
  - <https://devpixiv.hatenablog.com/entry/2015/12/24/182248>

## Progressive Web Appsの導入基礎

- Push Notification
  - service worker
  - ユーザーの許諾を得て、メリットを提示してからやったほうが良い

<https://github.com/kuu/the-offline-cookbook-ja/blob/master/ja.md>
