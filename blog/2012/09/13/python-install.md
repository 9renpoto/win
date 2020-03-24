---
title: 'python install'
date: '2012-09-13'
permalink: '/entry/2012/09/13/python-install/'
category: 'python'
---

# first Python

Pycon に参加しようと思ったんですが、Python 素人のボクはまず環境構築から。

## Python の version 管理

Python は pythonbrew+virtualenv で環境を作るのが良いらしいので、言われるがままに環境作ってみます。

## pythonbrew の環境構築

```sh
curl -kLO https://github.com/utahta/pythonbrew/raw/master/pythonbrew-install
chmod +x pythonbrew-install
./pythonbrew-install
```

pythonbrew の環境変数を通す
zsh の場合でも以下の内容を書くらしい。

```sh
[[ -s $HOME/.pythonbrew/etc/bashrc ]] && source $HOME/.pythonbrew/etc/bashrc

pythonbrew list -k # インストールできるversion確認
pythonbrew update # pythonbrewのupdate
```

2 系と 3 系の環境構築。

```sh
pythonbrew install 2.7.2
pythonbrew switch 2.7.2

pythonbrew install 3.2
pythonbrew switch 3.2
```

virtualenv の環境はまた今度する。
