---
title: 'Omit types'
date: '2019-06-26T01:18:00+09:00'
---

# TL;DR

- TypeScript で　`Omit` がサポートされた
- UnionTypes から `Omit` する難易度が高い

## formik-material-ui

- <https://github.com/stackworx/formik-material-ui/pull/82>
  - 公式の `Omit` は UnionTypes でもサポートしてるっぽい？🤔
- <https://github.com/microsoft/TypeScript/issues/28791>
  - もともと、UnionTypes から Omit
    するためには全部入りみたいな状態にしてそいつを対象に Pick, Exclude
    している？
- <https://github.com/sindresorhus/type-fest/blob/master/source/omit.d.ts#L17>
  - type-fest は UnionTypes のことは考慮できていない？
