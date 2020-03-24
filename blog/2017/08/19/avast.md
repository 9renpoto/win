---
title: 'avast network check'
date: '2017-08-19T21:37:00+09:00'
permalink: '/entry/2017/08/19/avast/'
---

# TL;DR

- `Infection blocked` に引っかかった
- ご認識の可能性は未報告

## 経緯

1. avast が警告を発しあるモジュールがダウンロードできない
   1. <https://github.com/takuyaa/kuromoji.js/issues/19>
1. virtualbox 上で警告のあった指定箇所を確認
1. 修正
   1. <https://github.com/takuyaa/kuromoji.js/pull/20>

## 心情

- チェックされている感じを久々に感じる、が懸念されている内容とその正規表現が理解できなかった
- セキュリティは難しい
