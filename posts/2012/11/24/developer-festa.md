---
title: "Python Developer Festa 参加してきました"
date: "2012-11-24"
permalink: "/entry/2012/11/24/developer-festa/"
categories:
  - "python"
---

# Python Developer Festa 参加してきたので、そのメモ

## Cloudera Impala について

@shiumachiさんより。

### Impala とは

- Clouderaが開発した低レイテンシ・分析特化型のクエリ実行基盤
  - google Dremel, Google F1などにインスパイアされて開発された
- データサイエンティストが使うことを想定している
- Hadoopはクエリの内容がメモリーに乗っからなかった場合、HDDに逃げちゃう
- Impalaはオンメモリー上で頑張ろうとする

#### Impala support 状況

##### 02 時点

- Trevni, RCFileのサポートは現状まだ、今後に対応予定
- Hiveで出来ることは、基本的にImpalaでは出来ないと思ってよい

### なぜ開発されたのか

Hadoop(Map Reduce)だと高レイテンシで、すぐに結果が欲しくても処理に時間がかかる。

Hiveのようで手軽に使えるSQL
のインターフェイスをもち、かつ低レイテンシエンジンが欲しかったからです。

### MapReduce とは

- Apache MapReduceとは
  - バッチ処理を分散して行うシステム
- Apache Hive
  - SQLライクに書ける
- MapReduceの問題
  - レイテンシが高い
  - 小さいキューを出しても数十秒時間かかる

### よくある質問

#### Q もう Hive いらないんじゃない

- 定期的に実行を行うクエリなどはHiveのほうが適しているのではないか

#### Qimpala が落ちたらどうするの

- クエリが全部こけます
- JOINのサイズ制限あるの
  - あります

## Python in Webkit

@omo2009さんより。

### Third party Tools

- WebKit
  - Buildbot
  - Trac

### 今回は `webkit-patch` について

    # Submitting for review
    webkit-patch post
    # Commiting a reviewd patch
    # Commit log は自動で書く
    webkit-patch land
    # Reverting specific version
    webkit-patch rollout
    #

プロジェクト特有の問題を解決するために使っている。

    watchlist
    suggest-reviewers
    suggest-nominations
    Bugzilla autocompletion
    IRC

- 誰にレビューしてもらえば良いかわからない
- 誰にレビューしてもらったか忘れちゃう
- 探すのに便利

IRCでレビューを頼むと断られにくい。

## Connpass について

@lanMLewis, @ae35概要と技術について。

### connpass とは

- BePROUDで運営しているイベント支援サイト
  - 2010/08 django dash
    - djangoを使って48時間でサービスを作ろう
    - 既存のイベント支援サービス（ATND)使いにくいよね
    - 作ってみよう
  - 大事だと思ってること
    - 実生活のつながり
    - 共有・成長する
    - イベントから広がるコミュニティ

### connpass で使われている技術

- サーバーサイド
  - MySQL
  - Redis
  - Django
  - Unix
  - Nginx
  - Gunicorn
- クライアントサイド
  - CoffeeScript
  - REQUIRE JS
  - JavaScript怖い

## PHP Language Update

### PHP 5.5 の目玉

- ジェネレートとコールーチン
  - yieldキーワードの追加
- foreachで変数分解だ
- empty()の括弧内に変数以外が指定可能に
- `finally`
  - `try-catch-finally`
    - なぜ今までになかったのか
  - fatal errorが発生すると `finaly` が呼ばれない

Pythonでお仕事している人が日本にもたくさんいて嬉しいです。

発表者のみなさまおつかれさまでした。
