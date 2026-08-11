---
title: 웹페이지에 크레들리 배지를 붙이는 코드
excerpt: 외부서비스 붙이는 방법
date: 2026-08-07
category: NEXT.JS
kind: coding
readTime:
tags:
  - portfolio
  - badge
  - credly
  - ccp
---
## 1. 코드와 주석



```tsx
"use client";

import Script from "next/script";

export function CredlyBadge() {
  return (
    <div className="credly-badge">
      <div
        data-iframe-width="150"
        data-iframe-height="270"
        data-share-badge-id="e188a4b4-2117-484b-959e-b2200fb9acec"
        data-share-badge-host="https://www.credly.com"
      />
      <Script
        id="credly-badge-script"
        src="https://cdn.credly.com/assets/utilities/embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
```

### 코드를 쉽게 설명하면

이 코드는 **Next.js에서 Credly 자격증 배지를 외부 스크립트로 불러와 화면에 표시하는 컴포넌트**이다.

1. `"use client";` : 이 컴포넌트는 브라우저에서 실행해야 한다.
2. `import Script from "next/script";` : Next.js의 외부 JavaScript 로딩 기능을 가져온다.
3. `export function CredlyBadge() {` : CredlyBadge라는 재사용 가능한 UI 컴포넌트를 만든다.
4. `return (` : 화면에는 다음 내용을 보여준다.
5. `<div className="credly-badge">` : credly-badge라는 CSS 클래스를 가진 영역을 만든다.
6. Credly에게 배지 크기, 배지 ID, Credly 서버 주소를 알려줄 빈 공간을 만든다.
```tsx
<div
  data-iframe-width="150"
  data-iframe-height="270"
  data-share-badge-id="..."
  data-share-badge-host="https://www.credly.com"
/>
```
7. 페이지가 준비되면 Credly JavaScript를 불러온다.
```tsx
<Script
  src="https://cdn.credly.com/assets/utilities/embed.js"
  strategy="afterInteractive"
/>
```

그 스크립트가 앞의 빈 `<div>`를 찾아서 실제 배지로 바꿔준다.

## 2. 해당 부분 이미지


>![[certified-badge-section.png]]

## 3. 이번에 배운 것

- 새롭게 이해한 것: 외부 서비스를 사이트에 붙이는 코드가 어떤 식으로 되어있는지 배웠다.

## 한 줄 정리

웹에 하나의 서비스를 붙이는게 생각보다 어려운 것 같다... 아닌가 이건 쉬운편인가?
