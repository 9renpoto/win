---
date: '2016-09-25T12:11:46+09:00'
permalink: '/entry/2016/09/25/ssh-agent/'
title: macOS キーチェインが動かなくなったので keychain を導入する
---

# macOS update メモ

ssh passphrase を常に問い合わされるようになった。

## 調査

- keychain
- ssh-agent

## keychain 入れてみる

- <https://github.com/9renpoto/dotfiles/pull/32>

解決出来た様子。

## Refs

- <https://qiita.com/u6k/items/5970618c4a8c23f71fb9>
- <https://qiita.com/tukiyo3/items/045f86c4242ec53953e2>
