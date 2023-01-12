---
date: '2016-08-31T21:26:35+09:00'
permalink: '/entry/2016/08/31/karma-webpack/'
title: TypeScript のテスト環境を考える
category: 'js'
---

# 上手く動かない

<https://travis-ci.org/9renpoto/ts/builds/156475663>

- アバウトな構成

```js
"devDependencies": {
  "@9renpoto/eslint-config": "^1.1.0",
  "@9renpoto/tslint-config": "^1.0.0",
  "@types/mocha": "^2.2.31",
  "@types/power-assert": "0.0.27",
  "awesome-typescript-loader": "^2.2.1",
  "codecov": "^1.0.1",
  "eslint": "^3.4.0",
  "json-loader": "^0.5.4",
  "karma": "^1.2.0",
  "karma-coverage": "^1.1.1",
  "karma-firefox-launcher": "^1.0.0",
  "karma-mocha": "^1.1.1",
  "karma-sourcemap-loader": "^0.3.7",
  "karma-webpack": "^1.8.0",
  "mocha": "^3.0.2",
  "npm-run-all": "^3.0.0",
  "power-assert": "^1.4.1",
  "rimraf": "^2.5.4",
  "tslint": "^3.15.1",
  "typescript": "^2.0.2",
  "webpack": "^1.13.2",
  "webpack-espower-loader": "^1.0.1"
}
```

`tsc` ・ `webpack` しても問題ないように見えるが、 `karma` を通した場合
`SyntaxError` など出てきて非常に厳しい。

<https://github.com/9renpoto/karma-power-assert-typescript-mocha-webpack-sample>

同様の構成で先に検証頂いているものを発見するも、現在構成との違いの無さに
こちらが動かない理由は不明、頭を悩ませる。
