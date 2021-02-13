---
date: '2021-02-13T22:30:00+09:00'
title: GoogleAnalytics 4でカスタムディメンションが設定できておらずハマる
---

# TL;DR

- 現在進行形
- 解決したいがとりあえず軌跡を記録する
- 目指したいゴールはGTMから配信されているGA4にカスタムディメンションを適応する

## Google Analytics 4

- firebase analytics統合版みたいなものが使える様になって気付いたらv4という更新としてリリースしたようだ
- 取り敢えずGoogle Analytics 4 から設定する
    - https://support.google.com/analytics/answer/10075209?hl=ja
- カスタムディメンションの個数制限はそのまま？
- インデックス表記ではなくこちらで名前を割り当てていける？
- タグマネージャーからは **ユーザープロパティ** と **設定フィールド** という2種類の概念が登場する
  - https://support.google.com/tagmanager/answer/9442095?hl=ja
  - `config` で設定するか `dataLayer` で設定するか
  - 一時的なものか恒久的なものかで設定の方法が違う？
- GoogleAnalytics の設定のデバッグには https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna/reviews?hl=ja やdebug tool より何がリクエストされているかなどを見ている
- 元々firebaseにあった event debug機能がgoogle analyticsにも移植されているようで、それも使えそう
    - https://firebase.google.com/docs/analytics/debugview?hl=ja
    - https://support.google.com/analytics/answer/7201382?hl=ja

## Goals

- カスタムで設定した属性をキーにどのぐらいの分布しているか調べたい

## 現状

- データを送っているようで入ってほしいところにはいらない
    - debug view からはdataは送ってそうに見えるがユーザープロパティとしてデータが送られることが正しそうなのにそのように見えない
    - データが正しく適応できていないため目的のフォーマットでデータがはいらない
- Google Tag Managerを経由して変数をGA4 にわたす場合
    - `dataLayer` 変数を経由して渡す必要があると思っているがうまく渡らない
    - `typeof dataLayer` が実行関数に置き換わると思っていたが原状はarrayのまま呼び出しが行われている？
    - `dataLayer` にpushしたカスタムデータが送られているように見えない、対象のdataがpushされているようには見える
        - 初期 pageview飛ばすまでにデータをあつめておく必要があるとかそれ系がある？ドキュメントがわかりにくい
    - pageview event がSPA等でも発火して送られるようになっており、仕込みの工数が下った
        - だがそれに伴って動きが隠ぺい化されておりデータのサイクルがいまいちつかめない（リバースエンジニアリングしようと思っている）