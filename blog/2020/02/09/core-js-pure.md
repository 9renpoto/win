---
date: '2020-02-09T14:00:00+09:00'
title: Preact with storyshots
---

# TL;DR

- `preact-compat` を使って `react-test-renderer` を都合よく動かせなかったのでテスト時には `react` に依存する
- `core-js-pure` が webpack の設定次第で意図せぬ変換をされてエラーになるので exclude

## Preact only development

- `preact` with `next.js` の環境を想定する
- `preact/compat` を使わない `preact` 開発はまだ開発環境として足りないことが多い
  - テスト周り
  - 既存 `react` 周辺ツールの多さ
- `react-test-renderer` の快適さ
  - `enzyme` であればの代替できる？
    - ちゃっかり内部で `react-test-renderer` に依存している
- <https://github.com/preactjs/enzyme-adapter-preact-pure>
  - 試したいけど preact only で開発できるほどのコンポーネントがほしい
  - <https://github.com/prateekbh/preact-material-components> を見ているけど中身 esmodule build でテストを書いたりするのが辛い
  - `next.js` っぽいなにかが使いたい（まだ見つけられていない）

## Refs

- https://github.com/g59/ranking/pull/1342
- https://stackoverflow.com/questions/57361439/how-to-exclude-core-js-using-usebuiltins-usage
