---
title: ex) Server Component는 어디까지 서버일까?
excerpt: 경계를 직접 그려보며 이해한 렌더링 모델.
date: 2026-07-24
category: REACT
kind: coding
readTime: 8분
published: true
---

# 서버에서 그려진다는 말

Server Component를 처음 보면 “서버에서만 실행되는 컴포넌트”라고 외우기 쉽다. 하지만 실제로 중요한 건 **어떤 코드와 데이터가 브라우저로 넘어가는지** 구분하는 일이었다.

## 내가 이해한 가장 작은 기준

- 데이터를 가져오고 화면의 뼈대를 만드는 일은 서버에서 한다.
- 클릭과 입력처럼 사용자의 행동에 반응하는 일은 클라이언트에서 한다.
- 클라이언트 컴포넌트라고 해서 화면 전체가 클라이언트에서만 만들어지는 것은 아니다.

```tsx
export default async function PostPage() {
  const post = await getPost();
  return <PostBody post={post} />;
}
```

지금은 “서버냐 클라이언트냐”를 컴포넌트 이름으로 판단하지 않고, **브라우저에 꼭 필요한 코드인가?**를 먼저 묻고 있다.

