---
title: Minglogue 다크모드 구현 기록
excerpt: Minglogue 전체에 다크모드를 적용했다.
date: 2026-08-05
category: Developement
kind: coding
readTime: 5분
tags:
  - css
  - Darkmode
  - ui
  - accessibility
---
## 목적

1. 퇴사의사를 밝힌 후 이직준비를 하면서 공부를 조금씩 하는 중인데, 내자리가 문 앞에 있다보니 밝은 화면이 과해서 다크모드의 필요성을 느꼈다.
2. 시스템은 다크모드인데 블로그홈페이지만 밝아서 눈이 아팠다.

그러나 단순히 배경을 검게 바꾸는 수준이 아니라 다음 조건을 만족하도록 구현했다.

- 사용자의 **기기 설정에 따라 최초 테마** 자동 선택
- 홈페이지 상단에서 라이트·다크모드 **직접 전환**
- 새로고침하거나 다시 방문해도 선택한 테마 유지
- 메인·글 목록·게시글·포트폴리오 전체 적용
- 다크모드에서 흐릿하거나 겹쳐 보이는 색상 대비 개선

![[minglogue-dark-mode.png]]
## 구현 구조

다크모드는 크게 세 부분으로 나누어 구현했다.

1. 테마 전환 버튼
2. 페이지가 열리기 전 테마 초기화
3. CSS 변수에 따른 전체 색상 변경

---

## 1. 테마 전환 버튼 만들기

`components/theme-toggle.tsx`에 클라이언트 컴포넌트를 만들었다.

```tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "minglogue-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggleTheme() {
    const nextTheme = dark ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setDark(nextTheme === "dark");
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={dark ? "라이트 모드" : "다크 모드"}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
```

버튼을 누르면 HTML 최상위 요소에 다음 속성이 들어간다.

```html
<html data-theme="dark">
```

라이트모드에서는 다음과 같이 바뀐다.

```html
<html data-theme="light">
```

CSS는 이 `data-theme` 값을 보고 사용할 색상을 결정한다.

선택한 테마는 `localStorage`의 `minglogue-theme` 키에 저장한다. 따라서 새로고침하거나 브라우저를 다시 열어도 이전에 선택한 모드가 유지된다.

---

## 2. 화면이 그려지기 전에 테마 적용하기

저장된 테마를 React가 실행된 이후에만 적용하면 페이지가 처음 열릴 때 밝은 화면이 잠깐 나타날 수 있다. 이를 흔히 테마 깜빡임이라고 한다.

이 현상을 줄이기 위해 `app/layout.tsx`에 초기화 스크립트를 추가했다.

```tsx
<Script id="theme-init" strategy="beforeInteractive">
  {`
    (() => {
      const savedTheme = localStorage.getItem("minglogue-theme");
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      document.documentElement.dataset.theme =
        savedTheme || (systemDark ? "dark" : "light");
    })();
  `}
</Script>
```

적용 순서는 다음과 같다.

1. 브라우저에 저장된 테마가 있는지 확인한다.
2. 저장된 값이 있다면 그 값을 우선 적용한다.
3. 저장값이 없다면 기기의 다크모드 설정을 확인한다.
4. 콘텐츠가 표시되기 전에 `data-theme` 값을 지정한다.

즉, 처음 방문한 사용자는 기기 설정을 따르고 이후부터는 직접 선택한 모드를 유지한다.

---

## 3. CSS 변수로 전체 색상 변경하기

라이트모드의 기본 색상은 `:root`에서 관리한다.

```css
:root {
  --paper: #fffdf4;
  --ink: #171713;
  --yellow: #ffd62e;
  --muted: #68665d;
  --line: #24241f;

  color-scheme: light;
}
```

다크모드는 같은 변수에 다른 값을 넣는다.

```css
:root[data-theme="dark"] {
  --paper: #181816;
  --ink: #f3f0e6;
  --yellow: #725328;
  --muted: #c4c0b4;
  --line: #8a877c;

  color-scheme: dark;
}
```

각 변수의 용도는 다음과 같다.

| 변수 | 용도 | 다크모드 색상 |
|---|---|---|
| `--paper` | 전체 배경 | `#181816` |
| `--ink` | 기본 글자 | `#f3f0e6` |
| `--yellow` | 밑줄·버튼·강조 배경 | `#725328` |
| `--muted` | 날짜·설명·보조 문구 | `#c4c0b4` |
| `--line` | 테두리·구분선 | `#8a877c` |

본문과 여러 컴포넌트는 직접 색상을 지정하지 않고 변수를 사용한다.

```css
body {
  background: var(--paper);
  color: var(--ink);
}
```

이 구조 덕분에 모든 페이지의 색상을 개별적으로 다시 작성하지 않아도 테마에 따라 전체 색상이 바뀐다.

---

## 다크모드 전용 세부 조정

CSS 변수만 바꾸면 모든 영역이 자연스럽게 보일 것 같지만 실제로는 그렇지 않았다.

라이트모드를 기준으로 만들어진 일부 카드에는 흰색이나 검은색이 직접 지정되어 있었다. 이런 영역은 다크모드 전용 스타일을 추가로 작성했다.

```css
[data-theme="dark"] .portfolio-section,
[data-theme="dark"] .portfolio-result {
  background: #242421;
  color: var(--ink);
}

[data-theme="dark"] .home-featured-project {
  background: #181816;
  border-color: var(--line);
  color: var(--ink) !important;
}

[data-theme="dark"] .pudding-home {
  background: #332d20;
}
```

입력창과 편집기처럼 별도의 배경을 가진 요소도 조정했다.

```css
[data-theme="dark"] input,
[data-theme="dark"] textarea,
[data-theme="dark"] select {
  background: #242421;
  color: var(--ink);
}
```

코드 표현과 보조 UI도 어두운 배경으로 바꿨다.

```css
[data-theme="dark"] .markdown-body :not(pre) > code {
  background: #30302c;
}

[data-theme="dark"] .archive-chip,
[data-theme="dark"] .studio-message {
  background: #2b2b27;
}
```

---

## 노란색 대비 문제

처음에는 라이트모드와 같은 밝은 노란색 `#ffd62e`을 다크모드에서도 사용했다.

하지만 게시글의 따뜻한 흰색 글자와 밝은 노란색 밑줄이 겹치면서 글자가 잘 보이지 않았다. 인증 카드에서도 노란 배경 위 흰색 글자의 대비가 너무 약했다.

첫 번째 수정에서는 다크모드의 노란색을 머스타드 계열로 낮췄다.

```css
--yellow: #b88a1b;
```

그래도 여전히 노란색의 느낌이 강해 최종적으로 갈색에 가까운 앰버 브라운으로 변경했다.

```css
--yellow: #725328;
```

강조 배경 위 글자색은 검은색 대신 다른 본문과 동일한 따뜻한 흰색을 사용했다.

```css
[data-theme="dark"] .issue-card,
[data-theme="dark"] .badge-section,
[data-theme="dark"] .archive-filter button.is-active,
[data-theme="dark"] .markdown-body a:hover {
  color: var(--ink);
}
```

최종 조합은 다음과 같다.

```css
background: #725328;
color: #f3f0e6;
```

이 조합으로 밝은 노란색이 튀는 문제를 줄이고 다크모드 전체의 따뜻한 분위기를 유지했다.

---

## 변경 과정에서 발견한 문제

배포가 성공했다고 표시됐지만 운영 페이지가 이전 CSS 파일을 계속 참조하는 경우가 있었다.

또 어떤 배포에서는 HTML이 새 CSS 파일을 참조했지만 해당 CSS 파일이 잠시 `404`를 반환했다. 이 상태라면 홈페이지가 스타일 없이 표시될 수 있다.

따라서 배포 성공 메시지만 확인하지 않고 다음 항목까지 검사하게 했다.

1. 운영 HTML이 최신 CSS 파일명을 참조하는지 확인
2. 해당 CSS 파일 URL이 실제로 열리는지 확인
3. CSS 안에 새 색상 값이 들어 있는지 확인
4. 브라우저에서 계산된 최종 색상 확인

최종 운영 화면에서 확인한 값은 다음과 같다.

```text
다크모드 강조 배경: rgb(114, 83, 40) / #725328
다크모드 강조 글자: rgb(243, 240, 230) / #f3f0e6
```


---

## 최종 결과

다크모드 적용 후 다음 기능이 동작한다.

- 우측 상단의 달·해 버튼으로 테마 전환
- 기기 설정에 따른 최초 모드 선택
- 사용자가 선택한 테마 자동 저장
- 새로고침 이후에도 선택 유지
- 메인페이지와 게시글의 동일한 테마 사용
- 포트폴리오, 인증 카드, 버튼, 입력창까지 대응
- 어두운 화면에서 보조 글자와 구분선의 가독성 개선
- 게시글 흰 글자와 강조 밑줄의 충돌 해결
- 라이트모드의 기존 디자인은 그대로 유지

최종적으로 다크모드는 단순한 색상 반전이 아니라 각 화면의 용도와 대비를 다시 조정하는 작업이었다.

## 배운 점

- 다크모드는 배경과 글자색만 반전해서 완성되지 않는다.
- 라이트모드에서 잘 보이는 강조색이 다크모드에서는 지나치게 밝을 수 있다.
- CSS 변수를 사용하면 전체 테마를 일관되게 관리할 수 있다.
- 사용자의 테마 선택은 `localStorage`로 간단하게 유지할 수 있다.
- 페이지 렌더링 전에 테마를 적용해야 화면 깜빡임을 줄일 수 있다.
- 배포 성공과 실제 운영 반영은 별개이므로 정적 파일까지 확인해야 한다.
- 최종 검증은 코드가 아니라 실제 브라우저의 계산된 스타일을 기준으로 해야 한다.