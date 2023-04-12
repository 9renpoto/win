---
title: 'GraphQL: Schema first or Code first 🤔'
date: '2019-09-30T18:00:00+09:00'
---

# TL;DR

- GraphQL は万能ではない
- Code first をもう少し素振りする

## Graph QL

- GraphQL のサーバー実装ができないか
  [NestJS](https://docs.nestjs.com/graphql/quick-start) を素振りしている
- Swagger 等で Definition を管理する機会を数度経験したがコードとの乖離が苦しい
- Code first まで言わずともある程度型が一致してほしい
- 別に Client
  のコードまで生成しなくても良い（むしろ品質が悪いぐらいなら使わない）
- Interface は乖離しないようにしたい

## Must to have

- Frontend, Backend 共通のものとして（片方から｜両方）生成できる
- CI で乖離を検知できる

## Want to have

- 実装が先行しない状態を許容できる（Schema first)
- Generate フローが単方向
- [Apollo](https://github.com/apollographql) とか State
  管理まで面倒見る気みたいっすよ？

## Nest + GraphQL

- **Schema first or Code First** を選択して利用できる
  - Schema first では実装を縛れない判断で Code First
    [type-graphql](https://typegraphql.ml/) で実装
  - **TypeORM のコードをしばれるコードが生成できないと辛い** => (要検討）
- Service Class を CI して ORM につなげていける？
- [@next/graphql](https://github.com/nestjs/graphql) は薄い wrapper で基本的には
  GraphQL を意識すれば良い？
