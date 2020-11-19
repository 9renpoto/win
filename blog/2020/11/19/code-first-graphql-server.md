---
date: '2020-11-19T12:00:00+09:00'
title: Code-First GraphQL server
---

# TL;DR

- GraphQLサーバーを書くときにはCode-Firstで書くとメリットが大きい

## Code-First GraphQL server

[隅田川.js](https://sumidagawajs.connpass.com/event/193786/) というイベントで[発表してきました](https://code-first-graphql-server.web.app/)

初めてGraphQLサーバーを書くためのWAFとして自分は `@nestjs` を採用しました。理由は下記のようなものがあります。

- TypeScriptをメインで利用する
- Node.jsでサーバーを書く際に構造化された一定のルールがほしい
- REST APIも同じサーバー上から提供できる
- **GraphQLのための記述量を抑えられる**

## GraphQL serverを書く順序

`@nestjs/graphql` を用いた開発の場合、Code-Firstな開発とSDL(Schema Definition Language)-Firstな開発手法を選択することができます。

- https://docs.nestjs.com/graphql/quick-start#code-first
- https://docs.nestjs.com/graphql/quick-start#schema-first

Code-Firstを選択した場合、モデルとなるファイルに対してGraphQLのschemaとして公開するかをデコレーターを用いて明示していきます。

```typescript
import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  EntityRepository,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseRepository } from 'typeorm-transactional-cls-hooked'

@Entity('users')
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @Field()
  @Column()
  readonly name: string
}

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
```

上記のサンプルでは同時に `typeorm` を用いてデータベースschemaの定義を行っています。
データベースに保存されている情報と、GraphQLを用いて外部に公開するschemaの一部をモデルファイルの中に集約して管理することができます。
以降、必要なResolverを定義すれば、GraphQLとして公開されるQueryやMutationをコードによって表現できます。

対してSDL-Firstなアプローチでサーバーを開発した際の流れとして

1. GraphQLファイルを定義する
1. 手動で作成した `graphql` ファイルよりTypeScript Interfaceとなる型情報生成する
1. `implements` 等を用い型安全性を確保する
1. **`graphql` で生成したファイルに沿ったResolverを作成する**

といった流れになるかと思います。この2つを比較した際にCode-Firstな開発のメリットは **Resolverの実装とGraphQL定義との乖離をTypeScriptレベルで確認できる**
ことにあると考えています。また、nest.jsに関してはSDL-First、Code-Firstそれぞれに対してモデルファイルの作成（または生成）は必要であるため、記述量に関してもCode-Firstで作成される際にはメリットがあります。

Code-Firstによる記述のデメリットとして、**デコレータが多段で定義されがち** ということがあります。

## Prisma | Hasura

GraphQLサーバーを構築するにあたり、これらの2つは十分検討に値する仕組みが出来上がっていると思います。

> Prisma is a GraphQL ORM for your GraphQL (or REST) servers and not your frontend apps, kind of like a replacement for JDBC, SQL Alchemy, ActiveRecord and so on.

[hasura の記事を引用](https://hasura.io/blog/hasura-vs-prisma-9ffc7271eda8/) **PrismaはGraphQL ORM**だ、という表現をされています。

```
generator client {
  provider        = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  email String  @unique
  id    Int     @id @default(autoincrement())
  name  String?
  posts Post[]
}
```

Prismaでは独自のSDLとして `.prisma` ファイルを作成します。
比較のためにnest.jsとPrismaを併用しているサンプルを引用します。

```typescript
// https://github.com/prisma/prisma-examples/blob/latest/typescript/graphql-nestjs/src/user.ts
import 'reflect-metadata'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { Post } from './post'

@ObjectType()
export class User {
  @Field((type) => ID)
  id: number

  @Field()
  @IsEmail()
  email: string

  @Field((type) => String, { nullable: true })
  name?: string | null

  @Field((type) => [Post], { nullable: true })
  posts?: [Post] | null
}
```

`@nestjs/graphql` + `typeorm` の時と異なり、entityとなるfieldの定義と、GraphQLとして公開するSchemaの定義がprismaファイルとTypeScriptファイルに分離します。
記述量という点では `typeorm` を使わない `@nestjs/graphql` と言った感じなると思っています。database migrationやschemaの型やrelationといった情報を **Prisma** に移管できるようです。

上記まででは `typeorm` と `prisma` を好みで選択するようになる印象ですが、
Prismaはtypeormと異なりGraphQLに最適化されたdataloaderのような機構のクエリーを発行できるかもしれないので、
`@nestjs/graphql` + `typeorm` + `dataloader` といった記述量が削減できるかもしれないことや、Paginateに関するサポートがないか期待しています。

- https://stackshare.io/stackups/hasura-vs-prisma
- https://hasura.io/blog/hasura-vs-prisma-9ffc7271eda8/
- https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nestjs
- https://github.com/MichalLytek/type-graphql/blob/master/docs/authorization.md
- https://nexusjs.org/docs/adoption-guides/neuxs-framework-prisma-users
- https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-apollo-server
- https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nestjs

## Hasura

- Schema生成、GraphQL定義、認証周りの一部コードの作成、反映といったところまでWebUIをベースに、CLIはおまけで提供されている印象
- Migration機能や、`Hasura actions` などの定義によって同一機能のサーバーを定義できるようにはなっている（yml, graphlqによる管理）
