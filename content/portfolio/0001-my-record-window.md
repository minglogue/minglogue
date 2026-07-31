---
title: 내 기록창구 만들기
excerpt: Next.js와 Markdown으로 코딩 공부와 일상을 직접 작성하고 배포할 수 있도록 만든 개인 블로그 프로젝트입니다.
period: 2026.07.27 ~ 진행 중
role: 기획, 디자인 색감과 방향, 섹션 순서, AI와 함께 개발, 콘텐츠 작성
contribution: 80%
tools:
  - Next.js
  - React
  - TypeScript
  - Markdown
  - GitHub
  - Cloudflare
cover: blog-homepage-hero.png
featured: true
published: true
projectUrl: https://popcorn-kim-log.popcornkim58.workers.dev
githubUrl: https://github.com/popcorn-kim/popcorn-kim-log
---
![[obsidian-portfolio-frontmatter-properties.png]]
# 프로젝트 소개

코딩/네트웍 공부와 일상을 내가 원하는 모양과 형식으로 기록하기 위해 만든 개인 블로그입니다. 처음에는 정말 홈페이지를 만들 수 있을지 반신반의했지만, 포트폴리오로도 활용할 수 있는 나만의 기록 공간을 완성했습니다.

## 프로젝트를 만든 이유

기존 기록 도구의 정해진 형식에서 벗어나 색감, 글의 배치, 섹션 순서를 직접 정하고 싶었습니다. 공부하면서 생긴 질문과 실패 과정까지 오래 남길 수 있는 공간이 필요했습니다. 일종의 포트폴리오로 활용하고싶은 목적이 있었습니다.

## 내가 담당한 부분

- 사이트의 목적과 전체 방향 기획
- GPT가 제안한 세가지 디자인 중 한가지 결정 후 디테일 수정
- 메인 화면의 섹션 순서와 콘텐츠 구조 설계
- 코딩 기록, 일상, 푸딩이, 자격증, 포트폴리오 영역 구성
- AI와 대화하며 기능을 만들고 문제를 검토
- Markdown으로 실제 콘텐츠 작성

## 사용한 기술

Next.js와 React로 페이지와 화면 부품을 구성하고, TypeScript로 데이터 구조와 동작을 관리했습니다. 글은 Markdown으로 작성하고 GitHub에 저장하며, Cloudflare Workers를 통해 인터넷에 배포합니다.

## 어려웠던 점

- GitHub와 Cloudflare를 처음 연결하는 과정
- Obsidian에 넣은 이미지가 홈페이지에서 보이지 않던 문제
- 커밋, 푸시, 자동 배포의 차이 이해
- 홈페이지의 파일 구조와 각 도구의 역할 이해
- 새 글이 목록과 사이트맵에 자동으로 들어가는 구조 만들기

## 해결 과정

문제를 한꺼번에 보기보단 실제 홈페이지의 코드를 작은 부분으로 나누어 살펴봤습니다. 이미지 경로, 공개 설정, 배포 기록을 하나씩 확인하면서 원인을 찾았고, 반복되는 작업은 새 글을 추가하면 자동으로 처리되도록 개선했습니다.

## 프로젝트 결과

직접 글을 작성하고 GitHub에 올리면 홈페이지에 배포되는 개인 블로그를 완성했습니다. 코딩 기록과 일상, 반려햄스터 푸딩이의 사진을 한곳에 모았고, Google Search Console과 사이트맵도 연결했습니다.

## 관련 기록

- [홈페이지 만들기 프로젝트](/posts/0001-make-the-hompage)
- [app 폴더는 무슨 역할을 할까?](/posts/0002-app-folder)
- [푸딩이 기록의 이미지 문제](/posts/0005-pudding-log-error)

## 한 줄 정리

완성된 홈페이지보다 더 중요한 결과는, 내 기록이 인터넷에 나타나는 구조를 직접 이해하기 시작했다는 것입니다.
