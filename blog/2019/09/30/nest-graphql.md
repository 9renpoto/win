---
title: 'GraphQL: Schema first or Code first 🤔'
date: '2019-09-30T18:00:00+09:00'
---

# TL;DR

- GraphQLは万能ではない
- Code firstをもう少し素振りする

## Graph QL

- GraphQLのサーバー実装ができないか [NestJS](https://docs.nestjs.com/graphql/quick-start) を素振りしている
- Swagger等でDefinitionを管理する機会を数度経験したがコードとの乖離が苦しい
- Code firstまで言わずともある程度型が一致してほしい
- 別にClientのコードまで生成しなくても良い（むしろ品質が悪いぐらいなら使わない）
- Interfaceは乖離しないようにしたい

## Must to have

- Frontend, Backend共通のものとして（片方から｜両方）生成できる
- CIで乖離を検知できる

## Want to have

- 実装が先行しない状態を許容できる（Schema first)
- Generateフローが単方向
- [Apollo](https://github.com/apollographql) とかState管理まで面倒見る気みたいっすよ？

## Nest + GraphQL

- **Schema first or Code First** を選択して利用できる
  - Schema firstでは実装を縛れない判断でCode First [type-graphql](https://typegraphql.ml/) で実装
  - **TypeORMのコードをしばれるコードが生成できないと辛い** => (要検討）
- Service ClassをCIしてORMにつなげていける？
- [@next/graphql](https://github.com/nestjs/graphql) は薄いwrapperで基本的にはGraphQLを意識すれば良い？
