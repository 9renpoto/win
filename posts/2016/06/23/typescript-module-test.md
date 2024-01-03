---
date: '2016-06-23T11:25:56+09:00'
permalink: '/entry/2016/06/23/typescript-module-test/'
title: typescript test
category: js
---

# TypeScript の勉強を頑張ろう

- [9renpoto/javascript/pull/19](https://github.com/9renpoto/js/pull/19)

```json
{
  "devDependencies": {
    "eslint": "^2.13.1",
    "espower-typescript": "^5.0.1",
    "mocha": "^2.5.3",
    "power-assert": "^1.4.1",
    "tslint": "^3.11.0",
    "typescript-eslint-parser": "0.1.0-alpha-1",
    "typings": "^1.3.0"
  }
}
```

下記を満たす簡単なサンプルを書く。

- 複数module
- mochaによるテスト
- power-assertによるテスト

`espower-typescript` が通らないので中身を見て調べる。
