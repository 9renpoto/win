---
title: 'Go Conference 2013 spring参加してきました #gocon'
date: '2013-04-13'
permalink: '/entry/2013/04/13/gocon/'
categories:
  - 'go'
---

# Go Conference参加メモ

![image](https://lh5.googleusercontent.com/-QHzKGzPe248/UtoeV0tBZyI/AAAAAAAAEuA/zr0wYEPCETE/s583-no/IMG_0299.JPG)

## Go言語で作るWebアプリ @tenntenn

HTTPサーバー簡単に書ける。

- <https://docs.google.com/presentation/d/1rrY2oibeUrqjF4ga5L3EhDioIURcMCUOz7jBXHWBdOM/pub?start=false&loop=false&delayms=3000#slide=id.gb8818ff4_2_0>

## Go on AppEngine @najeira

- Go言語のメリット
  - 簡単
  - Nativeで速い、少メモリ
  - モダン（並列、型推論、Stractual subtyping(部分型）
- AppEngineのメリット
  - 保守しなくてよいので開発に集中できる
  - 大規模、伸縮
  - モダン（TQ、memcachedサポート）
- Testing
  - AppEngine上でGo言語だけでテストを行うことは難しい
  - testbed <https://github.com/najeira/testbed>
- Goの優位性
  - 起動が速い（AppEngineとの相性は良い）
- 速度についての補足
  - 常にGoが速いというわけではない（I/O、etc)
- まだ完全以降にコストかけて頑張るほどのノウハウはたまってない

## Gorutine and channel @Jxck\_

- メモ漏れ

## Go Schaduler @methane

- <https://gist.github.com/methane/5377227#file-goscheduler-md>
  - Goroutine
    - 奥が深い

## Goのどのあたりが良いか鵜飼さん

- Goの第一印象
  - 慣れた言語から見ると違和感がある
- 設計方針

  > many on the decisions in Go are motivated by experience working on
  > and maintaing large code bases at Google.

  - 書きやすさより読みやすさ、修正しやすさ
  - シンプルな仕様、簡潔な文法
  - 細部まできちんと考えたコードを書くようになる

- 型宣言
  - 逆
  - これは複雑な変数定義を行った際に分かりやすい
- コメント書くぐらいならコンパイラーにチェックさせろよ
- クラス
  - 型定義
  - 型に対してメソッドを追加する
- 使われないコード
  - Goはコンパイルエラーを徹底的に出す
  - 大規模なコードになってきたとき、容易に肥大化してしまう問題を防ぐ
- エラー処理
  - try ~ catchにしたがる
    - 制御の流れが複雑になる
    - 変なGOTOをしているような感じ
  - 基本的にエラーはその場で処理させる

## 無題 @moriyoshi

- Goでゲームを作るためのライブラリー紹介
  - 画面出力
    - SDL系： go-sdl / gosdl
    - OpenGL系： gl / GoGL
  - 音
    - portaudio-go / go-openal / pulsego
  - 入力
    - 入力のSDL系は標準でできる
    - OpenGL系ではGo-GLUT / glfwなど使える
- <https://github.com/moriyoshi/gohex>
