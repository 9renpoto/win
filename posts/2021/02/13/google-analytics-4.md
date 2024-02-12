---
date: '2021-02-13T22:30:00+09:00'
title: GoogleAnalytics 4でカスタムディメンションが設定できておらずハマる
---

# TL;DR

- 現在進行形
- 解決したいがとりあえず軌跡を記録する
- 目指したいゴールはGTMから配信されているGA4にカスタムディメンションを適応する

## Google Analytics 4

- firebase analytics統合版みたいなものが使える様になって気付いたらv4
  という更新としてリリースしたようだ
- 取り敢えずGoogle Analytics 4から設定する
  - https://support.google.com/analytics/answer/14240153?hl=ja&visit_id=638430859981796861-106775261&rd=1
- カスタムディメンションの個数制限はそのまま？
- インデックス表記ではなくこちらで名前を割り当てていける？
- タグマネージャーからは **ユーザープロパティ** と **設定フィールド** という2
  種類の概念が登場する
  - https://support.google.com/tagmanager/answer/9442095?hl=ja
  - `config` で設定するか
  - `dataLayer` で設定するか
  - 一時的なものか恒久的なものかで設定の方法が違う？
- GoogleAnalyticsの設定のデバッグには
  https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna/reviews?hl=ja
  やdebug toolより何がリクエストされているかなどを見ている
- 元々 firebaseにあったevent debug機能がgoogle analytics
  にも移植されているようで、それも使えそう
  - https://firebase.google.com/docs/analytics/debugview?hl=ja
  - https://support.google.com/analytics/answer/7201382?hl=ja

## Goals

- カスタムで設定した属性をキーにどのぐらいの分布しているか調べたい

## 現状

- データを送っているようで入ってほしいところにはいらない
  - debug viewからはdata
    は送ってそうに見えるがユーザープロパティとしてデータを送られることが正しそうなのにそのように見えない
  - データが正しく適応できていないため目的のフォーマットでデータがはいらない
- Google Tag Managerを経由して変数をGA4にわたす場合
  - `dataLayer` 変数を経由して渡す必要があると思っているがうまく渡らない
  - `typeof dataLayer` が実行関数に置き換わると思っていたが原状はarray
    のまま呼び出しが行われている？
  - `dataLayer` にpushしたカスタムデータが送られているように見えない、対象の
    dataがpushされているようには見える
    - 初期pageview
      飛ばすまでにデータをあつめておく必要があるとかそれ系がある？ドキュメントがわかりにくい
  - pageview eventがSPA
    等でも発火して送られるようになっており、仕込みの工数が下った
    - だがそれに伴って動きが隠ぺい化されておりデータのサイクルがいまいちつかめない（リバースエンジニアリングしようと思っている）
