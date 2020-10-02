---
title: 'クラス図を簡単に - PlantUML'
date: '2013-11-13'
permalink: '/entry/2013/11/13/escape-ime/'
---

# PlantUML

これから設計をはじめます、という時に
今までは小さな機能では、スキーマの設計から始めてしまっていたのですが。

久々に「クラス図を書いてみよう」という話になり
どう書こうとなったのでメモ。

CUIで書けるのが最高です。

依存関係をテキストベースのみで記述できるので非常に助かりました。

図の綺麗さなどを意識せず関係を記述することに集中できるのが魅力。

```bash
wget http://sourceforge.net/projects/plantuml/files/plantuml.jar/download -O plantuml.jar
java -jar "plantuml.jarのパス" [option] 入力ファイル [...]
```

で入力ファイルを目的のUMLを生成します。

Graphvizが必要なのでインストールしておきます
macはbrewだけで入りました。

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

## GUI関連

Officeなどを使って作っても良いのですが、
専用のツールもメモ。

### astah\*

Officeツール以外で関連ツールを探すと上位に出てくる[良いツール](https://astah.change-vision.com/ja/product/astah-community.html)です。

### Cacoo

今までなかなか縁がなく利用していなかったCacooですが、そういえば使ってなかったなと思い軽く使ってみました。

ChromeAppなどで使えますし、お気軽さではダントツ。
