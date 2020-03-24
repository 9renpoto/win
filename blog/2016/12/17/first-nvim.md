---
date: '2016-12-17T14:03:55+09:00'
permalink: '/entry/2016/12/17/first-nvim/'
title: neovim 導入
categories:
  - 'vim'
  - 'neovim'
---

# TL;DR

- neovim は早いように感じる
- lua 拡張は動かない様子

## Install

公式の通りですんなり入りました。

```rb
# Brewfile

tap 'neovim/neovim'
brew 'neovim'
```

## Usage

- `~/.vimrc` を見ていないようなので調整
- 基本的に設定は使い回せる

```shell
export XDG_CONFIG_HOME=~/src/github.com/9renpoto/dotfiles/.config
```

neocomplete が使えないようだがこの際プラグインを見直したいので一旦保留。

- <https://github.com/9renpoto/dotfiles/pull/45>

## Refs

- <https://giginet.hateblo.jp/entry/2015/11/24/203823>
