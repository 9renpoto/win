---
title: 'クラス図を簡単に - PlantUML'
date: '2013-11-13'
permalink: '/entry/2013/11/13/escape-ime/'
tags: ['uml']
---

# PlantUML

これから設計をはじめます、という時に
今までは小さな機能では、スキーマの設計から始めてしまっていたのですが。

久々に「クラス図を書いてみよう」という話になり
どう書こうとなったのでメモ。

CUI で書けるのが最高です。

依存関係をテキストベースのみで記述できるので非常に助かりました。

図の綺麗さなどを意識せず関係を記述することに集中できるのが魅力。

```bash
wget http://sourceforge.net/projects/plantuml/files/plantuml.jar/download -O plantuml.jar
java -jar "plantuml.jarのパス" [option] 入力ファイル [...]
```

で入力ファイルを目的の UML を生成します。

Graphviz が必要なのでインストールしておきます
mac は brew だけで入りました。

```bash
brew install graphviz
```

これだけで使えます。

```markdown
@startuml
class Bugs {
-bug_id
-description
-created_at
}

class Comments {
-comment_id
-bug_id
-auther
}

class Auther {
-id
-name
}

Bugs --_ Comments
Auther --_ Comments
@enduml
```

![sample](https://dl.dropboxusercontent.com/u/9060848/PlantUML/PlantUML.png)

便利。

## 参考

- <https://abicky.net/2012/10/16/093737/>
- <http://yohshiy.blog.fc2.com/blog-entry-152.html>

## GUI 関連

Office などを使って作っても良いのですが、
専用のツールもメモ。

### astah\*

Office ツール以外で関連ツールを探すと上位に出てくる[良いツール](http://astah.change-vision.com/ja/product/astah-community.html)です。

### Cacoo

今までなかなか縁がなく利用していなかった Cacoo ですが、そういえば使ってなかったなと思い軽く使ってみました。

ChromeApp などで使えますし、お気軽さではダントツ。
