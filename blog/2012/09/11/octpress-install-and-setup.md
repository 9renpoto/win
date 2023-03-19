---
title: 'octpress install and setup'
date: '2012-09-11'
permalink: '/entry/2012/09/11/octpress-install-and-setup/'
---

# octpress試す

Octpressの利用を始めたので、簡単にインストール方法と設定、使い方などをメモ。

## github pageの初期化

```bash
mkdir username.github.com
cd username.github.com
git init

touch README.md
git add README.md
git commit -m 'first commit'

git remote add origin git@GitHub.com:username/username.github.com.git
git push -u origin master
```

### octpressのインストール

先ほど作成した _username.github.com_ と同じ階層にoctpressをcloneする。

```shell
git clone git://github.com/imathis/octopress.git octopress

cd octopress
gem install bundler

bundle install
Rake setup_github_pages

Rake generate
rake deploy

# 2つ一度にする
# Rake gen_deploy
```

### 記事投稿

記事の作成もコマンド1つタイトルは英語で。

```shell
rake new_post["my-new-page"]
# zshは以下のように書く
rake new_post\["my-new-page"\]
```

markdownの勉強にもなるし、GitHubとも仲良くなれるし、なかなかに良い仕組み。

いろいろ勉強します。

参考文献。

- <http://tokkonopapa.github.io/blog/2011/12/30/octopress-on-github-and-bitbucket/>
- <https://blog.glidenote.com/blog/2011/11/07/install-octopress-on-github/>
