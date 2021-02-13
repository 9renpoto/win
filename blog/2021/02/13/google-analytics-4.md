---
date: '2021-02-13T22:30:00+09:00'
title: GoogleAnalytics 4でカスタムディメンションが設定できておらずハマる
---

# TL;DR

- 現在進行形
- 解決したいがとりあえず軌跡を記録する
- 目指したいゴールは GTM から配信されている GA4 にカスタムディメンションを適応する

## Google Analytics 4

- firebase analytics 統合版みたいなものが使える様になって気付いたら v4 という更新としてリリースしたようだ
- 取り敢えず Google Analytics 4 から設定する
  - https://support.google.com/analytics/answer/10075209?hl=ja
- カスタムディメンションの個数制限はそのまま？
- インデックス表記ではなくこちらで名前を割り当てていける？
- タグマネージャーからは **ユーザープロパティ** と **設定フィールド** という 2 種類の概念が登場する
  - https://support.google.com/tagmanager/answer/9442095?hl=ja
  - `config` で設定するか `dataLayer` で設定するか
  - 一時的なものか恒久的なものかで設定の方法が違う？
- GoogleAnalytics の設定のデバッグには https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna/reviews?hl=ja や debug tool より何がリクエストされているかなどを見ている
- 元々 firebase にあった event debug 機能が google analytics にも移植されているようで、それも使えそう
  - https://firebase.google.com/docs/analytics/debugview?hl=ja
  - https://support.google.com/analytics/answer/7201382?hl=ja

## Goals

- カスタムで設定した属性をキーにどのぐらいの分布しているか調べたい

## 現状

- データを送っているようで入ってほしいところにはいらない
  - debug view からは data は送ってそうに見えるがユーザープロパティとしてデータが送られることが正しそうなのにそのように見えない
  - データが正しく適応できていないため目的のフォーマットでデータがはいらない
- Google Tag Manager を経由して変数を GA4 にわたす場合
  - `dataLayer` 変数を経由して渡す必要があると思っているがうまく渡らない
  - `typeof dataLayer` が実行関数に置き換わると思っていたが原状は array のまま呼び出しが行われている？
  - `dataLayer` に push したカスタムデータが送られているように見えない、対象の data が push されているようには見える
    - 初期 pageview 飛ばすまでにデータをあつめておく必要があるとかそれ系がある？ドキュメントがわかりにくい
  - pageview event が SPA 等でも発火して送られるようになっており、仕込みの工数が下った
    - だがそれに伴って動きが隠ぺい化されておりデータのサイクルがいまいちつかめない（リバースエンジニアリングしようと思っている）
