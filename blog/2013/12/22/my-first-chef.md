---
title: '入門chef'
date: '2013-12-22'
permalink: '/entry/2013/12/22/my-first-chef/'
categories:
  - 'ruby'
  - 'chef'
---

# chef memo

環境構築といえば、chefだという噂を随分と聞くようになってきましたが、
なんだかんだと使ってなかったのでメモ。
とはいえ、レシピは誰かが書いてるので、
今回は出来る限りレシピを使う方法で構築を目指す。

## 前準備

```ruby
# Gemfileに記載
source 'https://rubygems。org'  # URLの指定。呪文だと思って毎回書く

gem 'berkshelf'
gem 'chef'
gem 'knife-solo'
```

必要なgemをいつものように。

```shell
bundle install
```

chef-soloを使えるように初期設定を行う。

```shell
bundle exec knife configure
```

## そろそろchef

ひな形の生成。

```bash
$ bundle exec knife solo init chef-repo
$ tree chef-repo/
chef-repo/
├── cookbooks
├── data_bags
├── nodes
├── roles
├── site-cookbooks
└── solo。rb
```

忘れないうちにコミット。

```shell
cd chef-repo
git init
git add 。
git commit -m 'first commit'
```

公式なり、Githubにて公開されているレシピを利用しやすくるものとして **Berksfile** があります。

```ruby
site :opscode # Berksfile

cookbook "apt"
cookbook "git"
cookbook "zsh"
cookbook 'vim'
cookbook 'the_silver_searcher'
```

公開されているレシピの情報を記述しておけば、コマンド1つで落としてこれます。
便利。

```shell
bundle exec berks install --permalink cookbooks
```

vagrant側でchefが使えるように以下のコマンドを実行。

```shell
bundle exec knife solo prepare nodename
```

インストールしたいレシピを追加
node/nodename.json。

```js
{
  "run_list": [
    "recipe[apt]",
    "recipe[git]",
    "recipe[zsh]",
    "recipe[vim]",
    "recipe[the_silver_searcher]"
  ]
}
```

レシピはできたのでcookしましょう。

```shell
bundle exec knife solo cook nodename
```

## 参考

- [qiita.com/uchiunyo/item](https://qiita.com/uchiunyo/items/5aa243f7a39ae443e10d)
