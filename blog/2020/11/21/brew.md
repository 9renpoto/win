---
date: '2020-11-21T12:00:00+09:00'
title: Brew Alternative Installs ( Intel mac )
---

# TL;DR

- homebrewのinstall先にカスタムして `/opt/homebrew` をintel macで使うことができなくなっていそう

## homebrew install path

> However do yourself a favour and install to /usr/local on macOS Intel, /opt/homebrew on macOS ARM, and /home/linuxbrew/.linuxbrew on Linux. Some things may not build when installed elsewhere. One of the reasons Homebrew just works relative to the competition is because we recommend installing here. Pick another prefix at your peril!

- もともとinstall `/user/local` 配下にインストールが推奨されていたが適切な場所ではないと判断し `/opt/homebew` へinstallを変更していた
- 今回 **ARM** 版Macの誕生により`/opt/homebew` 配下へのinstallが推奨され、 Intel Macで `/opt/homebew` 配下にbrewを配置している場合動かなくなっていそう

```
Error: Cannot install in Homebrew on Intel processor in ARM default prefix (/opt/homebrew)!
```

対応方法がいまいちはっきりしていないが全部入れ直すしかないだろうか

## Refs

- https://github.com/Homebrew/brew/commit/5afff3f3aa1d806855d460e5f39bfbef28ef6262#diff-fcf6d384bb8308546cecce54bb9678c715f95c119b402f9b61a78e0cf3d8fbc4
- https://qiita.com/usamik26/items/601f5612bd3f8a21cc41
