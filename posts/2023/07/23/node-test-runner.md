---
date: '2023-07-23'
title: Try `node:test` with TypeScript
snippet: node:test を動かしたかった
---

## TL;DR 🚶‍♂️🚶‍♂️🚶‍♂️

- Output: <https://github.com/g59/bot/pull/1037>
- Must be used with a loader to use TypeScript
  - <https://github.com/nodejs/help/issues/3902#issuecomment-1217235905>
- The `assert` syntax can be used
  - <https://nodejs.org/api/assert.html>
  - <https://nodejs.org/api/test.html>
- I still don't use it at work

## Good

- Type information is maintained 👌
- `describe`, `it` can be used 👌

## Not Sure

- Asynchronous process not terminated 😶‍🌫️
- API is different on `node18` `node20`
  <https://github.com/kachick/times_kachick/issues/192>

## Visual

- Very simple
  - <https://nodejs.org/api/assert.html#assertvalue-message>
- Not particularly excellent

## 感想

- TypeScriptを使って小さなものを作りたい時に、nodejsを使うほど小さく便利なものではなかった
- もうしばらく様子を伺う
