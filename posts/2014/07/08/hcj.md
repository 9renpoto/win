---
title: '#hcj-2014'
date: '2014-07-08'
permalink: '/entry/2014/07/08/hcj/'
categories:
  - 'hadoop'
---

# Hadoop Conference Japan 2014 に参加してきました

個人的な所感としては。

- spark楽しそう（だけどまだ触るには勇気が）
- Prestoも熱そう
- MapR書くよりもSQL書く方がお手軽

以下はメモ書き。

## keynote

### hadoop を取り巻く環境について

- 始めて普及した並列分散
  - データの読み込みのスループットを最大化
    - 全件データの処理を実現
  - シンプルなモデル（MapReduce)
  - YARN
    - MapReduceからそれ以外のアルゴリズムも
    - 複数の並列分散エンジンを併用できる環境
    - メモリーの大容量化、10Gbpsネットワークの普及
      - インメモリー処理の実現性の向上

### The Future of Data

Doug Cutting

- 未来について
  - ハードウェアの価格の低下、性能の向上
  - データの重要性の向上
  - オープンソースが勝ち残る

### The Future of spark

Patric Wendlell

- Sparkの目的
  - データサイエンティスト、エンジニア能力の拡張
  - 表現力のあるクリーンなAPIの提供
  - 多様な環境にわたって統合されたランタイム
- API 　 stability
  - 3か月サイクルでマイナーリリース
  - 必要におおじてメンテナンスリリース
- Spark SQL
- MLlib
  - Spark + R
- DataBricks

### Hadoop エコシステムの片鱗と見えてきた使いドコロ

- TreasureData
  - なぜHadoop使うのか
    - Hadoopを使うのは最適な解か
      - 安いストレージとして使うだけならHadoopより良い物は沢山ある
    - データの収集ソフトウェア
      - 多種多様なデータ・ソース
      - fluentd,flumea,kafka,sqoop
    - ファイルフォーマット
      - Schema on Read
    - 管理・人的コスト低減の支援
    - 簡単にデータを扱うか
      - Tez, Spark
    - SQL on Hadoop
      - Impala, SlarkSQL, Presto Drill
      - Mahout, Spark MLlib
    - 今までの時代
      - データを入れるだけ入れたけど、レポート化できる人の限られている
      - 今までは何でも入れられるだけ
      - これからはだれでも取り出せるようにしないと意味がない
    - Hadoop -> MPP
      - Twitter: Hadoop -> Vertica
      - Pinterest: Hadoop -> redshift
    - 非構造化データの領域に踏み込む
    - 混沌の時代

## セッション

### マルチテナント化に向けた Hadoop の最新セキュリティー事情

- Hadoopのユースケースの移り変わり
  - バッチ処理を効率よく行うため
    - 部門単位での利用、クラスターの乱立
  - 近年
    - バッチ処理 + インタラクティブな処理
    - SQLによるアクセス
  - データは一部の人だけのものではない
    - クラスターの共有（マルチテナント）
  - マルチテナントのメリット
    - データの複製不要
    - 業務の取り巻き
    - 性能・効率の改善
  - 課題 　
    - リソースの分離と管理
    - Role管理
- マルチテナントとセキュリティーの関連性
  - 認証
    - kerberos
      - 相手が何者であるかを保証するプロトコル
      - 暗号化
  - 認可
    - HDFS ACL
      - ファイルシステムレベルでのaccess control
    - Apache Sentry
      - データベース、テーブルview、行列の粒度でアクセス制御
- 認可モジュールSentryの紹介
  - Apache Sentryはモジュールとして開発されている

### BigQuery and the world after MapReduce

- BigData at Google
  - ログ分析するのにMapReduceを書いてる場合じゃない
  - BigQuery ( sql base )
    - indexなんてないんや
  - 全文検索、120億行、10秒ぐらい
  - storage料金
  - Quesy料金
- Column Oriented Storage
  - もはやスタンダード
- Colossus File System
  - GFSの次のもの
- MPP
  - 1TBの内容を数秒で舐めるためには何台必要なのか
- JOIN
  - small join
  - broadcast JOIN
    - ばらまいてコピー => JOIN
  - JOIN Each
    - shuffleしてjoinできる
- BigQuery Streaming
  - fluentd
  - fluent-plugin-bigquery
- BigQuery User-Defined-Function-with-JavaScript
  - クエリ内にJavaScript書く
- Cloud Pub/Sub
- FlumeJava
  - [論文あるよ!](https://pages.cs.wisc.edu/~akella/CS838/F12/838-CloudPapers/FlumeJava.pdf)
- MillWheel
  - [論文あるよ!](http://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/41378.pdf)

### SQL によるバッチ処理とストリーム処理

- @tagomoris
  - stream処理
    - norikra
  - Hadoop
    - Hive/ Presto
  - SQL is NOT the best;
    - But, SQL is better than NONE.
  - Batch processing
    - hive
  - Stream processing
    - storm
    - kafka
    - esper
    - norikra
    - fluentd
- Lamda Architecture
  - Streaming
    - 速報値
  - Batch
    - 確定値
  - 両方に対応したい
- Stream処理
  - レイテンシが低い
  - 同じ処理をバッチとしても実行できる必要がある

### YARN

- TD
  - PlazumaDB
    - S3上で動作
    - HDFS is not used
  - Hadoop Cluster
    - Customize hadoop
    - Customize hive
    - Customize Pig
  - PlazumaDB
    - Customize Impala
    - Customize Presto
  - 独自queue
  - 独自scheduler
  - YARN cluster
    - プロダクションにはまだ入れてないが環境整えている
- YARNとは
  - Job History Server注意
    - 起動してないと過去ログが追えなくなる
  - NOTE
    - Use the Hadoop 2.4.0 and later
      - Capacity Scheduler、there is a bug
      - deadlock
    - hadoop-conf-pseudo doees not work
    - 2.2.0 and 2.4.0
      - 結構違うので注意

### Presto

- what is Presto
  - Facebookで作られてoss化
  - HDFS上のデータを可視化したい
    - うまくいかない
    - hiveが遅すぎる
  - hiveをバッチ化 => 中間DBに入れる
    - 中間DBはスケールしない
  - HDFSに保存してないものは入れなきゃならない
- Presto
  - 中間データベースの取り除く有効な手段
  - 他のデータストアを舐めることにも対応
  - Hiveとの使い分けが必要
    - 巨大なjoin
    - group by
  - Interactiveなクエリを発行できる
  - 複数のデータ・セットをまとめて表示できる
- BI tools
  - 可視化に利用していく
  - `ODBC/JDBC is very complicated!`
- Prestoの実行モデルについて
  - not MapReduce
  - 全部並行で動いてる
    - 一個死んだら全部死ぬ
    - メモリー溢れてしまうとクエリが死んでしまう
  - メモリーの使用量はクラスターで管理されて、クラスターが死ぬことはない（はず）
    - がクエリは死ぬ
