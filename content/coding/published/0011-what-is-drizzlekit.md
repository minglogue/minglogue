---
title: Drizzle Kit란? TypeScript로 데이터베이스 구조 관리하기
excerpt: 이 글에서 다룬 내용을 한 문장으로 요약합니다.
date: 2026-08-04
category: NEXT.JS
kind: coding
readTime:
tags:
  - work
---
프로젝트에 데이터베이스를 도입하면서 다음과 같은 설정 파일을 작성했다.

```tsx
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "sqlite",
});
```

처음 보면 데이터베이스 연결 설정처럼 보이지만, 정확히는 **Drizzle Kit가 데이터베이스 구조를 어떻게 관리할지 알려주는 설정**이다.

## Drizzle Kit의 정의

Drizzle Kit는 Drizzle ORM과 함께 사용하는 **데이터베이스 스키마 및 마이그레이션 관리용 CLI 도구**다.

조금 더 쉽게 말하면, TypeScript로 작성한 테이블 설계를 읽고 데이터베이스에 필요한 SQL을 만들어 주는 개발 도구다.

```
TypeScript로 작성한 테이블 설계
                ↓
           Drizzle Kit
                ↓
       SQLite용 SQL 파일 생성
                ↓
         데이터베이스에 반영
```

공식 문서에서는 Drizzle Kit를 Drizzle의 SQL 데이터베이스 마이그레이션 관리 도구로 설명한다. 스키마를 기반으로 마이그레이션 생성 및 실행, 데이터베이스 구조 가져오기, Drizzle Studio 실행 등을 지원한다.

## 먼저 알아야 할 세 가지 개념

### 1. 데이터베이스 스키마

스키마는 데이터베이스의 구조와 규칙을 뜻한다.

예를 들어 블로그 글을 저장하는 `posts` 테이블에는 다음과 같은 항목이 있을 수 있다.

- 글 ID
- 제목
- 본문
- 작성일
- 공개 여부

Drizzle에서는 이러한 구조를 SQL이 아니라 TypeScript로 선언할 수 있다.

```tsx
import {
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  published: integer("published", {
    mode: "boolean",
  }).notNull(),
});
```

이 파일은 단순한 TypeScript 타입 선언이 아니다. 실제 데이터베이스에 어떤 테이블과 컬럼을 만들어야 하는지 나타내는 설계도다.

### 2. 마이그레이션

서비스를 개발하다 보면 데이터베이스 구조가 계속 바뀐다.

처음에는 `title`과 `content`만 있었는데 나중에 `category` 컬럼이 필요할 수 있다.

```
변경 전
posts(id, title, content)

변경 후
posts(id, title, content, category)
```

이때 기존 데이터를 유지하면서 데이터베이스 구조를 변경해야 한다. 이러한 변경 이력과 적용 과정을 **마이그레이션**이라고 한다.

Drizzle Kit는 현재 스키마와 이전 스키마를 비교해 필요한 SQL을 생성한다.

```tsx
ALTER TABLE `posts`
ADD `category` text;
```

공식 문서에 따르면 `drizzle-kit generate`는 현재 스키마의 스냅샷과 이전 마이그레이션을 비교해 SQL 마이그레이션 파일과 새로운 스냅샷을 생성한다.

### 3. ORM

ORM은 애플리케이션 코드에서 데이터베이스를 다루기 쉽게 만들어 주는 도구다.

SQL을 직접 작성하면 다음과 같다.

```tsx
SELECT * FROM posts WHERE published = 1;
```

Drizzle ORM을 사용하면 TypeScript 코드로 표현할 수 있다.

```tsx
const posts = await db
  .select()
  .from(postsTable)
  .where(eq(postsTable.published, true));
```

여기서 **Drizzle ORM**과 **Drizzle Kit**의 역할은 다르다.

- Drizzle ORM: 애플리케이션 실행 중 데이터를 조회·추가·수정·삭제
- Drizzle Kit: 개발 과정에서 테이블 구조와 변경 이력을 관리

비유하면 Drizzle ORM은 데이터베이스를 사용하는 도구이고, Drizzle Kit는 데이터베이스의 구조를 설계하고 공사하는 도구다.

## Drizzle Kit로 할 수 있는 일

### SQL 마이그레이션 생성

```
npx drizzle-kit generate
```

TypeScript 스키마의 변경사항을 분석해 SQL 마이그레이션 파일을 만든다.

### 마이그레이션 적용

```
npx drizzle-kit migrate
```

생성된 SQL 마이그레이션 중 아직 적용되지 않은 항목을 데이터베이스에 반영한다. 데이터베이스 연결 정보인 `dbCredentials`가 필요하다. 

### 스키마를 데이터베이스에 직접 반영

```
npx drizzle-kit push
```

별도의 마이그레이션 파일을 만들지 않고 현재 TypeScript 스키마를 데이터베이스에 직접 반영한다.

빠른 프로토타입이나 로컬 개발에서는 편리하지만, 변경 이력을 명확하게 남겨야 하는 프로젝트라면 `generate`와 `migrate`를 사용하는 편이 안전하다. 

### 기존 데이터베이스 구조 가져오기

```
npx drizzle-kit pull
```

이미 만들어진 데이터베이스를 분석해 Drizzle용 TypeScript 스키마로 변환한다.

### 데이터베이스를 화면으로 확인

```
npx drizzle-kit studio
```

Drizzle Studio를 실행해 데이터베이스 테이블과 데이터를 브라우저 화면에서 확인하고 관리할 수 있다.

## 내가 작성한 설정 해석하기

다시 설정 파일을 살펴보자.

```tsx
import { defineConfig } from "drizzle-kit";
```

`drizzle-kit` 패키지에서 `defineConfig`를 가져온다.

`defineConfig`는 설정 객체의 타입을 검사하고 코드 편집기의 자동완성을 지원한다. 설정을 실행하는 핵심 함수라기보다 **Drizzle Kit 설정을 올바른 형식으로 작성하도록 돕는 함수**에 가깝다.

```tsx
export default defineConfig({
```

이 설정을 파일의 기본값으로 내보낸다. Drizzle Kit 명령을 실행하면 일반적으로 프로젝트 루트의 `drizzle.config.ts`를 찾아 이 설정을 읽는다.

### `out: "./drizzle"`

```
out: "./drizzle",
```

생성된 마이그레이션 파일과 스키마 스냅샷을 저장할 위치다.

예를 들어 `generate`를 실행하면 대략 다음과 같은 파일이 생긴다.

```
drizzle/
├── 0000_initial.sql
└── meta/
    ├── _journal.json
    └── 0000_snapshot.json
```

SQL 파일에는 실제 데이터베이스 구조를 변경하는 명령이 들어가고, 메타데이터에는 스키마 변경사항을 비교하기 위한 기록이 들어간다.

`out`을 생략해도 기본 경로가 `./drizzle`이므로 현재 설정은 기본값을 명시적으로 표현한 셈이다. [Drizzle 설정 파일 문서](https://orm.drizzle.team/docs/drizzle-config-file)

### `schema: "./db/schema.ts"`

```
schema: "./db/schema.ts",
```

데이터베이스 테이블이 선언된 TypeScript 파일의 위치다.

Drizzle Kit는 이 파일을 읽어 다음 정보를 파악한다.

- 어떤 테이블이 있는지
- 각 테이블에 어떤 컬럼이 있는지
- 기본키와 외래키는 무엇인지
- 어떤 컬럼이 필수인지
- 인덱스와 고유값 조건은 무엇인지

즉, `db/schema.ts`가 데이터베이스 구조의 기준인 **원본 설계도** 역할을 한다.

### `dialect: "sqlite"`

```tsx
dialect: "sqlite",
```

사용하는 데이터베이스의 종류가 SQLite라는 뜻이다.

데이터베이스마다 지원하는 기능과 SQL 문법에 차이가 있다. Drizzle Kit는 `dialect`를 확인해 해당 데이터베이스에 맞는 SQL을 생성한다.

예를 들어 같은 테이블 변경이라도 SQLite와 PostgreSQL에서 필요한 SQL이 다를 수 있다. 따라서 어떤 데이터베이스용 마이그레이션을 만들어야 하는지 반드시 알려줘야 한다.

## 내가 Drizzle Kit를 사용한 이유

이 설정을 기준으로 보면 내가 Drizzle Kit를 사용한 가장 직접적인 이유는 다음과 같다.

### SQLite 데이터베이스를 사용하기 위해

프로젝트에서 `dialect: "sqlite"`를 지정했다. 따라서 Drizzle 스키마를 SQLite 문법에 맞는 데이터베이스 구조로 변환할 도구가 필요했다.
Drizzle Kit가 TypeScript로 작성한 설계와 SQLite 사이의 변환을 담당한다.

### 데이터베이스 구조를 TypeScript 코드로 관리하기 위해

테이블 구조를 별도의 SQL 파일만으로 관리하지 않고 `db/schema.ts`에서 TypeScript로 선언했다.
덕분에 다음과 같은 장점이 생긴다.

- 코드 편집기에서 자동완성을 받을 수 있다.
- 잘못된 테이블 또는 컬럼 정의를 타입 검사로 일부 발견할 수 있다.
- 애플리케이션 코드와 데이터베이스 구조를 같은 언어로 관리할 수 있다.
- 스키마 변경 내용을 Git으로 추적할 수 있다.

### SQL을 매번 직접 작성하지 않기 위해

컬럼을 추가하거나 테이블을 변경할 때마다 SQLite용 SQL을 직접 작성할 수도 있다.
하지만 직접 관리하면 현재 스키마와 SQL 마이그레이션이 서로 달라질 가능성이 있다. Drizzle Kit를 사용하면 스키마의 변경사항을 비교해 필요한 SQL을 생성할 수 있다.

### 데이터베이스 변경 이력을 남기기 위해

`out`을 `./drizzle`로 지정했기 때문에 생성된 마이그레이션 파일을 프로젝트에 보관할 수 있다.
이렇게 하면 다음 내용을 확인할 수 있다.

- 최초에 어떤 테이블을 만들었는지
- 언제 어떤 컬럼을 추가했는지
- 다른 개발 환경에 어떤 변경을 적용해야 하는지
- 배포 시 데이터베이스가 어떤 순서로 변경됐는지

결국 Drizzle Kit를 사용한 이유는 단순히 데이터베이스에 연결하기 위해서가 아니다. **TypeScript로 작성한 데이터베이스 설계를 SQLite용 SQL로 변환하고, 구조의 변경 이력을 일관되게 관리하기 위해서**다.

## 이 설정만으로 데이터베이스에 연결되는가?

아니다.

현재 설정에는 데이터베이스 주소를 나타내는 `dbCredentials`가 없다.

```tsx
export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "sqlite",
});
```

따라서 이 설정만으로 확실하게 할 수 있는 대표 작업은 스키마를 읽어 마이그레이션 SQL을 생성하는 것이다.

```
npx drizzle-kit generate
```

반면 다음처럼 데이터베이스에 직접 접근하는 명령은 연결 정보가 추가로 필요하다.

```
npx drizzle-kit migrate
npx drizzle-kit push
npx drizzle-kit pull
npx drizzle-kit studio
```

예를 들어 로컬 SQLite 파일을 사용한다면 프로젝트 환경에 맞춰 다음과 같은 연결 설정이 추가될 수 있다.

```tsx
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "sqlite",

  dbCredentials: {
    url: "./sqlite.db",
  },
});
```

다만 Cloudflare D1, Turso 또는 다른 SQLite 계열 서비스를 사용한다면 연결 방식이 달라질 수 있으므로 프로젝트의 실제 데이터베이스 환경에 맞춰 설정해야 한다.

## 실제 작업 흐름

이 설정을 사용하는 일반적인 흐름은 다음과 같다.

### 1. 스키마 작성

```tsx
// db/schema.ts
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
});
```

### 2. 마이그레이션 생성

```
npx drizzle-kit generate
```

### 3. 생성된 SQL 확인

```tsx
CREATE TABLE `posts` (
  `id` integer PRIMARY KEY NOT NULL,
  `title` text NOT NULL
);
```

### 4. 데이터베이스에 적용

```
npx drizzle-kit migrate
```

### 5. 애플리케이션에서 Drizzle ORM으로 사용

```tsx
await db.insert(posts).values({
  id: 1,
  title: "첫 번째 글",
});
```

역할을 구분하면 다음과 같다.

```
db/schema.ts
데이터베이스 구조를 TypeScript로 선언
        ↓
Drizzle Kit
마이그레이션 SQL을 생성하고 적용
        ↓
SQLite
실제 데이터 저장
        ↑
Drizzle ORM
애플리케이션에서 데이터 조회·수정
```

## 마무리

Drizzle Kit는 데이터 자체를 저장하는 데이터베이스도 아니고, 애플리케이션에서 데이터를 조회하는 ORM 그 자체도 아니다.

Drizzle Kit의 핵심 역할은 다음 한 문장으로 정리할 수 있다.

> **TypeScript로 작성한 데이터베이스 설계를 실제 SQL 구조로 변환하고, 그 변경 이력을 관리하는 개발 도구다.**

내 프로젝트에서는 `db/schema.ts`를 데이터베이스 구조의 기준으로 삼고, 이를 SQLite에 맞는 SQL 마이그레이션으로 만들기 위해 Drizzle Kit를 사용했다.

덕분에 데이터베이스 구조를 애플리케이션 코드와 함께 관리하고, 변경 내용을 추적하며, 반복적인 SQL 작성도 줄일 수 있다.