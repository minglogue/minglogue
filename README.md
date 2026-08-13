# Minglogue

디자인, 마케팅을 거친 밍띠의 코딩 공부, 일상, 포트폴리오
그리고
반려햄스터 푸딩이의 기록을 담는 개인 블로그입니다.
페이지 방문 : https://blog.minglogue.workers.dev

## 기술 구성

- Next.js / React / TypeScript
- vinext / Cloudflare Workers
- GitHub 기반 소스 및 콘텐츠 관리

## 시작하기

Node.js 22.13 이상이 필요합니다.

```bash
pnpm install
pnpm run dev
```

## 주요 명령

- `pnpm run dev`: 로컬 개발 화면 실행
- `pnpm run build`: 배포용 빌드 검사

## 게시와 자동 배포

`main` 브랜치에서 아래 게시 폴더 또는 연결 이미지가 변경되면 Cloudflare Workers Builds가 빌드를 검사한 뒤 `blog` 사이트를 자동으로 배포합니다.

- `content/coding/published/`
- `content/daily/published/`
- `content/portfolio/published/`
- `content/pudding/published/`
- `content/media/`

초안 폴더(`drafts`)의 변경만으로는 배포되지 않습니다. 배포 명령은 `pnpm run build`와 `pnpm run deploy:cloudflare`이며 프로덕션 브랜치는 `main`입니다.

## 앞으로 추가할 기능

- 코딩 및 일상 글 목록·상세 페이지 [완료]
- GitHub Markdown 기반 글 저장 [완료]
- 밍띠 전용 글쓰기 스튜디오 [진행중]
- 자격증 배지, 포트폴리오, 푸딩이 공간 [완료]
- GA4 및 검색엔진 최적화 [진행중]
- 댓글기능 추가
- 조회수 등 통계페이지 개발
