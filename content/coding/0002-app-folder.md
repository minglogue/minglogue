---
title: Next.js는 어떻게 폴더를 홈페이지 주소로 바꿀까?
excerpt: 접속->폴더확인->coding폴더발견->coding/page.tsx실행
date: 2026-07-30
category: NEXT.JS
kind: coding
readTime: 5분
published: true
---

# 무엇을 알게되었나요?

- 우리 홈페이지 구조

| 코드 위치                       | 홈페이지 주소      |
| --------------------------- | ------------ |
| `app/page.tsx`              | `/`          |
| `app/coding/page.tsx`       | `/coding`    |
| `app/daily/page.tsx`        | `/daily`     |
| `app/pudding/page.tsx`      | `/pudding`   |
| `app/studio/page.tsx`       | `/studio`    |
| `app/posts/[slug]/page.tsx` | `/posts/글이름` |


## 1. 홈페이지 접속 과정


/coding 접속
   ↓
app 폴더 확인
   ↓
coding 폴더 발견
   ↓
coding/page.tsx 실행
   ↓
코딩 글 목록 표시

## 2. 이번에 배운 것

- 새롭게 이해한 것: app이라는 폴더는 공간. 폴더 이름은 방이름. 그 안의 파일은 방 안 인테리어(화면). /coding은 그 방을 찾아가는 주소.
- 헷갈렸던 것: 아직 잘 
- 문제를 해결한 방법:
- 다음에 다시 사용하고 싶은 방법:

## 한 줄 정리

`app` 안의 폴더는 주소가 되고, `page.tsx`는 그 주소의 화면이 된다.

