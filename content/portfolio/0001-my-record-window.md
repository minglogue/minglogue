---
title: 내 기록창구 만들기
excerpt: Next.js와 Markdown으로 코딩 공부와 일상을 직접 작성하고 배포할 수 있도록 만든 개인 블로그 프로젝트
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
users: 코딩 공부와 일상을 직접 기록하고 싶은 나
problem: 기존 기록 도구의 정해진 형식에서 벗어나 색감과 글의 배치까지 직접 결정할 수 있는 개인 공간이 필요했습니다.
solution: Markdown으로 글을 작성하면 코딩, 일상, 푸딩이, 포트폴리오 페이지에 자동으로 연결되는 Next.js 블로그를 만들었습니다.
result: 직접 글을 쓰고 GitHub에 올리면 Cloudflare를 통해 인터넷에 배포되는 나만의 기록 시스템을 완성했습니다.
highlights:
  - 4개의 콘텐츠 영역|코딩 기록, 일상, 푸딩이, 포트폴리오를 한 사이트에 모았습니다.
  - Markdown 자동 페이지 생성|새 글 파일을 추가하면 목록과 상세 페이지가 같은 디자인으로 만들어집니다.
  - GitHub·Cloudflare 배포|작성한 글을 저장하고 인터넷에 공개하는 흐름을 직접 운영합니다.
  - 검색 기반 완성|Google Search Console과 사이트맵을 연결해 검색엔진이 글을 발견할 수 있게 했습니다.
process:
  - PLAN|기록의 목적을 정했습니다|공부 과정과 일상을 자유롭게 남기면서 포트폴리오로도 활용할 방향을 정했습니다.
  - DESIGN|보이는 순서를 설계했습니다|검정, 아이보리, 노랑을 중심으로 색감과 메인 섹션의 순서를 결정했습니다.
  - BUILD|기록이 자동으로 연결되게 만들었습니다|Next.js와 TypeScript로 Markdown 글, 이미지, 태그가 화면에 나타나는 구조를 만들었습니다.
  - PUBLISH|직접 운영할 수 있게 연결했습니다|GitHub와 Cloudflare를 연결하고 사이트맵과 Search Console까지 설정했습니다.
gallery:
  - obsidian-portfolio-frontmatter-properties.png|옵시디언에서 프로젝트 속성을 작성한 화면
  - portfolio-properties-guide.png|포트폴리오 속성과 실제 화면의 연결을 정리한 안내 이미지
---
# 어려웠던 점과 해결

- GitHub와 Cloudflare의 역할이 달라 자동 배포 흐름을 이해하는 데 시간이 필요했습니다.
- Obsidian의 이미지 이름과 홈페이지가 찾는 경로가 다르면 사진이 나타나지 않았습니다.
- commit과 push의 차이를 몰라 작성한 글이 홈페이지에 반영되지 않는 일도 있었습니다.

문제를 한꺼번에 외우기보다 실제 홈페이지의 작은 부분을 하나씩 확인했습니다. 이미지 경로, 공개 설정, 배포 기록을 순서대로 살펴보면서 원인을 찾았고, 반복되는 작업은 Markdown 파일만 추가하면 자동으로 처리되도록 바꿨습니다.

# 내가 담당한 부분

- 사이트의 목적과 전체 방향 기획
- 여러 디자인 제안 중 하나를 선택하고 색감과 세부 배치 수정
- 메인 화면의 섹션 순서와 콘텐츠 구조 설계
- 코딩, 일상, 푸딩이, 포트폴리오 영역 구성
- AI와 대화하며 기능을 만들고 결과를 직접 검토
- Markdown으로 실제 콘텐츠 작성

# 관련 기록

- [홈페이지 만들기 프로젝트](/posts/0001-make-the-hompage)
- [app 폴더는 무슨 역할을 할까?](/posts/0002-app-folder)
- [푸딩이 기록의 이미지 문제](/posts/0005-pudding-log-error)

# 배운 점

완성된 홈페이지보다 더 중요한 결과는, 내 기록이 인터넷에 나타나는 구조를 직접 이해하기 시작했다는 것입니다.
