---
date: '2019-01-01T14:00:00+09:00'
permalink: '/entry/2019/01/01/first-rails/'
title: '重い腰を上げてRailsを見る'
---

# TL;DR

- いろんな会社に話を聞きに行ったが、まだまだ世界は Rails
- そうだ Rails を学ぼう
- とりあえず数時間だけ作った、 getting started を進めていきたい

<https://github.com/9renpoto/rb>

## Ruby を手に入れる

- `brew install ruby` で雑に使っていたわけだが流石にバージョンを固定する
  - 過去は rbenv を使っていたけれど
    [using asdf instend](https://github.com/daenney/rbenv)
    らしいので別で検討する
    - [omf/plugin-rbenv](https://github.com/oh-my-fish/plugin-rbenv)
      でも良かったけれど更新されてない
  - とりあえずメンテされてそうな
    [rstacruz/fish-asdf](https://github.com/rstacruz/fish-asdf) を入れる
  - `asdf` そのものは `brew` で入れて、かつ `/usr/local/bin`
    を使っていないためイマイチ動きが合わない
  - [`asdf` 公式](https://github.com/asdf-vm/asdf#setup) の方法で activate
    する（[refs](https://github.com/9renpoto/dotfiles/commit/ac00ecbeda4c16a3e741ab14158aad682241c1ce#diff-66758e6f92b7dd7008c34229fe0c9fe1R14)）

## Rails new

- Rails project を作るために Rails を入れる必要がある
- とりあえず [Docker compose](https://docs.docker.com/compose/rails/)
  公式の方法でプロジェクトを初期化する

## Rubocop を入れる

- どんなものなのか、とりあえず
  [rails のものらしい](https://github.com/toshimaru/rubocop-rails_config)
  設定を採用する
- 一部 format してくれるし便利な様子

## 現状

- lockfile があるけど
  [CI 上だけ Fail](https://travis-ci.com/9renpoto/rb/builds/96012247)
  する。つらい
- rspec は標準では scafford されないのか、と思った
- まだ coffee-script っぽいものを持ってる
- e2e テスト系のフレームワークにも依存して、どっしりしている

## とりあえず目指す着地

- DB 依存してテスト書く
- redis 依存してテスト書く
- coverage report 出す
- 噂の `webpacker` とかに依存する
- [hypernova-ruby](https://github.com/airbnb/hypernova-ruby) とかに依存する
