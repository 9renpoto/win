---
date: '2017-06-22T01:26:18+09:00'
permalink: '/entry/2017/06/22/brew-cask-language/'
title: brew caskにlanguageを指定するらしいけれど
categories:
  - 'macos'
  - 'bug'
---

# TL;DR

- 動いてくれ頼む

## Log

```shell
➜  ~ brew cask search firefox
==> Exact Match
firefox
==> Partial Matches
firefox-beta firefox-esr firefoxdeveloperedition firefoxnightly multifirefox
➜  ~
➜  ~ brew cask install firefoxnightly --language=en
Error: invalid option: --language=en
```

## Refs

- <https://rcmdnk.com/blog/2016/10/31/computer-mac-homebrew-firefox/>
- <https://github.com/Homebrew/homebrew-cask/blob/master/doc/cask_language_reference/stanzas/language.md#installation>

### 追記1 [2017/06/25]

- 修正リリースを待つ
  - [homebrew-cask/issues/35448](https://github.com/Homebrew/homebrew-cask/issues/35448#issuecomment-308112366)
