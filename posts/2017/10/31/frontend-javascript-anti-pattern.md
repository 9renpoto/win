---
title: 'Frontend JavaScript Anti-pattern'
date: '2017-10-31T23:00:00+09:00'
permalink: '/entry/2017/10/31/frontend-javascript-anti-pattern/'
category: 'js'
---

# TL;DR

- 自分のエゴで書いてる手癖や無駄な努力をコードレビューするのは非生産的
- 積極的にlinterを採用

## test

```javascript
import assert from "assert";

describe("test", () => {
  const { func } = require("./module");
  it("func", () => {
    assert(func("a") === "a");
  });
});
```

1. 1ファイル、single `describe`
   1. 親を1つ `describe.skip` `describe.only`
      できれば一旦闇を保留にできることが多い
   1. 1ファイルの持っている役割が大きすぎない、特に困っていない
1. テスト対象は `describe` の中でrequireする
   1. `describe.only` 実行をした際に不要なsrcを読み込まなくて良い
   1. 読み込まれただけで実行される関数はcoverageに含まれてしまう
   1. `coverage report` が読みやすい
1. `this` を使わない
   1. unused変数をlintで発見しやすい
   1. 長い

## src

```js
function mapStateToProps({ todos }: State) {
  return {
    tasks: { todos },
    onUpdate: (id) => todos[id].done(),
  }
}
```

1. `arrow function` vs `function`
   1. IE11を意識した場合、変換したら結局 `function` となる
   1. 読みやすさと生成された後のコードを妄想しつつ相談
   1. つい書きやすさと `return` の省略したさで `arrow function` を使うことも多い
   1. 読みやすければそれでいい気持ちになってきている
1. `class` syntaxを避ける
   1. ライブラリを開発しているときには使うけれどプロダクトを書く時には意識する
   1. 結局 `this` に状態を持たせる意味がそのclassにあるかが大事
   1. ファイルサイズがデカくなる

```js
var touch = "touch";
$("#id").on(`${touch}start ${touch}end`, (e) => {
  console.log(e);
});

function a(element) {
  // var element と書く３文字を省略して１文字にできる
  element = document.getElementById("foo");
  element.addEventListener("click", (e) => console.log(e));
}
```

1. 長い文字列は変数で受けて結合する
   1. 小さいことを売りにしているライブラリで見る
   1. 計算量も大事だが地道なファイルサイズ対策
1. 無駄な引数を定義する
   1. 変数定義分の文字列を節約させる
   1. htmlのタグなどを書く際に利用されている場合がある
   1. linterで積極的に使うなと怒られる（怒られる方が平和）

## まとめ

圧倒的老害感。

![image](https://4.bp.blogspot.com/-foiW8aYeL6s/VzZu-o6sxnI/AAAAAAAA6oQ/LHXzT0WsAX8LtB_U-msHk572kC_rY3VawCLcB/s800/mental_health_man.png)
