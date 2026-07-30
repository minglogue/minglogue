---
title: import란?
excerpt: 다른 파일에서 필요한 것 가져오기
date: 2026-07-30
category: NEXT.JS
kind: coding
readTime: 7분
published: true
---

# 무엇을 알게되었나요?

## 1. `import`

핵심 코드만 가져오고, `왜 이렇게 작성했는지`를 주석으로 설명합니다.

```tsx
import Link from "next/link";
```

```tsx
import { Arrow, SiteFooter, SiteHeader } from "@/components/site-chrome";
```

```tsx
import { CredlyBadge } from "@/components/credly-badge";
```

```tsx
import { getPuddingPosts } from "@/lib/pudding";
```

```tsx
export default function Home() {
```
### 코드를 쉽게 설명하면

1. 미리 우리 파일을 만들어둔다.
2. 첫번째 코드 : 페이지 안에서 다른 링크로 이동할 때 사용한다. html의 `<a>`와 비슷
3. 두번째 코드 : 우리가 이미 만들어둔 부품 세개 (화살표, 홈페이지 하단, 상단 메뉴) 가져와 라는뜻
4. 세번째 코드 : Credly 자격증 배지를 보여주는 부품을 가져와 라는 뜻
5. 네번째 코드 : 푸딩이 마크다운과 사진을 읽어오는 함수를 가져와 라는 뜻
6. 다섯번째 코드 :
	- `function Home()` : home이라는 화면의 부품을 만든다.
	- `export default` : 이 파일의 대표화면으로 내보낸다.

## 2.  이번에 배운 것

- 새롭게 이해한 것: import를 통해 다양한 부품을 가져와 활용할 수 있다.
- 다음에 다시 사용하고 싶은 방법: 메인페이지는 전부 '가져와' 로 한 화면에 보여진다.

## 한 줄 정리

`import` = 가져와.

