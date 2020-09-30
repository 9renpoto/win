---
title: 'python install'
date: '2012-09-13'
permalink: '/entry/2012/09/13/python-install/'
category: 'python'
---

# first Python

Pyconに参加しようと思ったんですが、Python素人のボクはまず環境構築から。

## Pythonのversion管理

Pythonはpythonbrew+virtualenvで環境を作るのが良いらしいので、言われるがままに環境作ってみます。

## pythonbrewの環境構築

```shell
curl -kLO https://github.com/utahta/pythonbrew/raw/master/pythonbrew-install
chmod +x pythonbrew-install
./pythonbrew-install
```

pythonbrewの環境変数を通す
zshの場合でも以下の内容を書くらしい。

```shell
[[ -s $HOME/.pythonbrew/etc/bashrc ]] && source $HOME/.pythonbrew/etc/bashrc

pythonbrew list -k # インストールできるversion確認
pythonbrew update # pythonbrewのupdate
```

2系と3系の環境構築。

```shell
pythonbrew install 2.7.2
pythonbrew switch 2.7.2

pythonbrew install 3.2
pythonbrew switch 3.2
```

virtualenvの環境はまた今度する。
