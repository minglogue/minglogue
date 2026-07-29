---
title: ex) 타입 좁히기를 습관으로 만드는 법
excerpt: 복잡한 조건문을 읽기 좋은 타입으로 바꾸기.
date: 2026-07-18
category: TYPESCRIPT
kind: coding
readTime: 6분
published: true
---

# 타입을 먼저 확인하는 습관

TypeScript 오류를 만날 때마다 `as`로 타입을 강제로 바꾸면 당장은 조용해진다. 대신 나중의 내가 더 큰 문제를 만나게 된다.

## 요즘 사용하는 순서

1. 값이 비어 있을 가능성을 먼저 확인한다.
2. `typeof`, `in`, `Array.isArray`처럼 실제 값을 검사한다.
3. 조건문 안에서 TypeScript가 알아서 타입을 좁히게 둔다.

```ts
function printLength(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.length;
  }

  return value.trim().length;
}
```

코드가 조금 길어져도, 다음에 읽었을 때 이유를 알 수 있는 쪽을 선택하려고 한다.

