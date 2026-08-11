"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PostKind = "coding" | "daily" | "portfolio" | "pudding";
type PostStatus = "drafts" | "published";

type StudioDraft = {
  title: string;
  slug: string;
  kind: PostKind;
  status: PostStatus;
  category: string;
  excerpt: string;
  tags: string;
  body: string;
  date: string;
  portfolioFile: string;
};

type CompressedImage = {
  id: string;
  name: string;
  blob: Blob;
  previewUrl: string;
  originalBytes: number;
  compressedBytes: number;
  width: number;
  height: number;
};

const STORAGE_KEY = "minglogue-studio-draft-v2";
const TEMPLATES: Record<PostKind, string> = {
  coding: `# 궁금했던 것

무엇이 궁금했는지 적어보세요.

## 알게 된 것

찾아보고 이해한 내용을 적어보세요.

## 직접 해본 것

코드나 실행 결과를 적어보세요.

## 다음에 볼 것

- 다음 질문`,
  daily: `# 오늘의 장면

오늘 기억하고 싶은 일을 적어보세요.

## 들었던 생각

그때의 생각이나 감정을 적어보세요.

## 남겨둘 것

- 내일의 나에게`,
  portfolio: `## 프로젝트 요약

### 문제

어떤 문제를 발견했는지 적어보세요.

### 해결

어떻게 접근하고 해결했는지 적어보세요.

### 결과

무엇이 달라졌는지 적어보세요.

## 핵심 결과

### 핵심 기능 | 한 문장 설명

구체적인 결과를 적어보세요.

## 만든 과정

### OBSERVE | 관찰

처음 관찰한 상황을 적어보세요.

### BUILD | 구현

만든 과정을 적어보세요.

# 배운 점

프로젝트를 통해 배운 것을 적어보세요.`,
  pudding: `사진을 먼저 선택하고 ‘본문에 넣기’를 눌러주세요.

오늘의 푸딩이는 어땠는지 짧게 적어보세요.`,
};

const INITIAL_BODY = TEMPLATES.coding;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeYaml(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function imageBaseName(fileName: string) {
  return slugify(fileName.replace(/\.[^.]+$/, "")) || `image-${Date.now()}`;
}

async function compressImage(file: File): Promise<CompressedImage> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("이미지를 처리할 수 없는 브라우저입니다.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error("이미지 압축에 실패했습니다.")),
      "image/webp",
      0.82,
    );
  });
  const name = `${imageBaseName(file.name)}.webp`;

  return {
    id: crypto.randomUUID(),
    name,
    blob,
    previewUrl: URL.createObjectURL(blob),
    originalBytes: file.size,
    compressedBytes: blob.size,
    width,
    height,
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function StudioEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [kind, setKind] = useState<PostKind>("coding");
  const [status, setStatus] = useState<PostStatus>("drafts");
  const [category, setCategory] = useState("NEXT.JS");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState(INITIAL_BODY);
  const [date, setDate] = useState(today);
  const [portfolioFile, setPortfolioFile] = useState("");
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const bodyField = useRef<HTMLTextAreaElement>(null);
  const imagesRef = useRef<CompressedImage[]>([]);

  const safeSlug = slugify(slug || title) || "new-post";
  const tagList = useMemo(
    () => tags.split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean),
    [tags],
  );
  const characterCount = body.replace(/\s/g, "").length;
  const readMinutes = Math.max(1, Math.ceil(characterCount / 500));
  const folderPath = `content/${kind}/${status}`;
  const githubFolderUrl = `https://github.com/minglogue/minglogue/tree/main/${folderPath}`;

  const markdown = useMemo(() => {
    const tagBlock = tagList.length
      ? `tags:\n${tagList.map((tag) => `  - "${escapeYaml(tag)}"`).join("\n")}\n`
      : "";

    if (kind === "pudding") {
      return `---
title: "${escapeYaml(title) || safeSlug}"
date: "${date}"
${tagBlock}---

${body}
`;
    }

    if (kind === "portfolio") {
      return `---
title: "${escapeYaml(title) || "새 프로젝트"}"
excerpt: "${escapeYaml(excerpt)}"
period: "${date.slice(0, 7)} ~"
role: "기획, 디자인, 구현"
contribution: "100%"
tools:
  - 사용한 도구
cover: ""
featured: false
projectUrl: ""
githubUrl: ""
portfolioFile: "${escapeYaml(portfolioFile)}"
users: ""
---

${body}
`;
    }

    return `---
title: "${escapeYaml(title) || "새 글 제목"}"
excerpt: "${escapeYaml(excerpt)}"
date: "${date}"
category: "${escapeYaml(category)}"
${tagBlock}kind: "${kind}"
readTime: "${readMinutes}분"
---

${body}
`;
  }, [body, category, date, excerpt, kind, portfolioFile, readMinutes, safeSlug, tagList, title]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<StudioDraft>;
        setTitle(draft.title ?? "");
        setSlug(draft.slug ?? "");
        setKind(
          draft.kind && ["coding", "daily", "portfolio", "pudding"].includes(draft.kind)
            ? draft.kind
            : "coding",
        );
        setStatus(draft.status === "published" ? "published" : "drafts");
        setCategory(draft.category ?? "NEXT.JS");
        setExcerpt(draft.excerpt ?? "");
        setTags(draft.tags ?? "");
        setBody(draft.body ?? INITIAL_BODY);
        setDate(draft.date ?? today());
        setPortfolioFile(draft.portfolioFile ?? "");
        setMessage("이 기기에 저장된 초안을 불러왔어요.");
      }
    } catch {
      setMessage("저장된 초안을 읽지 못했어요. 새 글로 시작합니다.");
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const draft: StudioDraft = {
      title, slug, kind, status, category, excerpt, tags, body, date, portfolioFile,
    };
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }, 350);

    return () => window.clearTimeout(timer);
  }, [body, category, date, excerpt, isReady, kind, portfolioFile, slug, status, tags, title]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => () => {
    imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, []);

  async function addImages(files: FileList | null) {
    if (!files?.length) return;
    setIsCompressing(true);

    try {
      const compressed = await Promise.all(Array.from(files).map(compressImage));
      setImages((current) => [...current, ...compressed]);
      setMessage(`${compressed.length}장의 사진을 WebP로 압축했어요.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "사진을 압축하지 못했어요.");
    } finally {
      setIsCompressing(false);
    }
  }

  function insertImage(image: CompressedImage) {
    const field = bodyField.current;
    const imageMarkdown = `\n\n![[${image.name}]]\n\n`;
    const start = field?.selectionStart ?? body.length;
    const end = field?.selectionEnd ?? start;
    setBody(`${body.slice(0, start)}${imageMarkdown}${body.slice(end)}`);
    setMessage(`${image.name}을 본문에 넣었어요.`);
    window.setTimeout(() => field?.focus(), 0);
  }

  function downloadImage(image: CompressedImage) {
    const link = document.createElement("a");
    link.href = image.previewUrl;
    link.download = image.name;
    link.click();
    setMessage(`${image.name}을 내려받았어요. GitHub의 content/media에 올리면 됩니다.`);
  }

  function changeKind(nextKind: PostKind) {
    const canReplace = body === TEMPLATES[kind] || body.trim() === "" ||
      window.confirm("현재 본문을 선택한 글 템플릿으로 바꿀까요?");

    setKind(nextKind);
    if (canReplace) setBody(TEMPLATES[nextKind]);

    if (nextKind === "pudding") {
      setCategory("PUDDING");
      setTags((current) => current || "푸딩이");
    } else if (nextKind === "portfolio") {
      setCategory("PROJECT");
    } else if (nextKind === "daily") {
      setCategory("DAILY");
    } else {
      setCategory("NEXT.JS");
    }

    const kindName = { coding: "코딩", daily: "데일리", portfolio: "프로젝트", pudding: "푸딩이" }[nextKind];
    setMessage(`${kindName} 템플릿을 준비했어요.`);
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setMessage(`Markdown을 복사했어요. GitHub의 ${folderPath}에 붙여넣으면 됩니다.`);
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeSlug}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`${safeSlug}.md 파일을 내려받았어요.`);
  }

  function resetDraft() {
    if (!window.confirm("이 기기에 저장된 작성 내용을 모두 비울까요?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setTitle("");
    setSlug("");
    setKind("coding");
    setStatus("drafts");
    setCategory("NEXT.JS");
    setExcerpt("");
    setTags("");
    setBody(INITIAL_BODY);
    setDate(today());
    setPortfolioFile("");
    setMessage("새 글 준비가 끝났어요.");
  }

  return (
    <div className="studio-workspace" id="new-post">
      <div className="studio-toolbar">
        <div>
          <p className="panel-label">NEW MARKDOWN</p>
          <strong>{isReady ? "이 기기에 자동 저장 중" : "초안 불러오는 중"}</strong>
        </div>
        <div className="studio-stats" aria-label="글 통계">
          <span>{characterCount.toLocaleString("ko-KR")}자</span>
          <span>약 {readMinutes}분</span>
        </div>
      </div>

      <div className="studio-grid">
        <section className="studio-form" aria-label="Markdown 글 작성">
          <div className="studio-field">
            <label htmlFor="studio-title">제목</label>
            <input
              id="studio-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="오늘 기록할 것을 한 문장으로"
            />
          </div>
          <div className="studio-form-row studio-form-row-three">
            <div className="studio-field">
              <label htmlFor="studio-kind">글 종류</label>
              <select id="studio-kind" value={kind} onChange={(event) => changeKind(event.target.value as PostKind)}>
                <option value="coding">궁금했던 것들</option>
                <option value="daily">일상 이야기</option>
                <option value="portfolio">프로젝트</option>
                <option value="pudding">푸딩이 사진</option>
              </select>
            </div>
            <div className="studio-field">
              <label htmlFor="studio-status">저장 위치</label>
              <select id="studio-status" value={status} onChange={(event) => setStatus(event.target.value as PostStatus)}>
                <option value="drafts">초안 · 비공개</option>
                <option value="published">게시 · 공개</option>
              </select>
            </div>
            <div className="studio-field">
              <label htmlFor="studio-date">날짜</label>
              <input id="studio-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
          </div>
          <div className="studio-form-row">
            <div className="studio-field">
              <label htmlFor="studio-category">카테고리</label>
              <input id="studio-category" value={category} onChange={(event) => setCategory(event.target.value)} />
            </div>
            <div className="studio-field">
              <label htmlFor="studio-slug">파일 이름</label>
              <input id="studio-slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder={safeSlug} />
              <small>{folderPath}/{safeSlug}.md</small>
            </div>
          </div>
          <div className="studio-field">
            <label htmlFor="studio-excerpt">한 줄 설명</label>
            <input id="studio-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} placeholder="글 목록에 보일 짧은 설명" />
          </div>
          <div className="studio-field">
            <label htmlFor="studio-tags">태그</label>
            <input id="studio-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Next.js, 공부, 기록 (쉼표로 구분)" />
          </div>
          {kind === "portfolio" && (
            <div className="studio-field">
              <label htmlFor="studio-portfolio-file">포트폴리오 PDF</label>
              <label className="studio-image-picker" htmlFor="studio-portfolio-file">
                <strong>{portfolioFile || "PDF 파일 선택하기"}</strong>
                <span>선택한 PDF는 content/media에 함께 올려주세요</span>
              </label>
              <input
                className="studio-file-input"
                id="studio-portfolio-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setPortfolioFile(file?.name ?? "");
                  setMessage(file ? `${file.name}을 프로젝트 속성에 연결했어요.` : "PDF 연결을 해제했어요.");
                }}
              />
              {portfolioFile && (
                <button className="studio-template-button" type="button" onClick={() => setPortfolioFile("")}>
                  첨부 해제
                </button>
              )}
            </div>
          )}
          <div className="studio-field">
            <label htmlFor="studio-body">본문</label>
            <textarea ref={bodyField} id="studio-body" value={body} onChange={(event) => setBody(event.target.value)} />
            <button
              className="studio-template-button"
              type="button"
              onClick={() => {
                if (body === TEMPLATES[kind] || window.confirm("현재 본문을 기본 템플릿으로 다시 바꿀까요?")) {
                  setBody(TEMPLATES[kind]);
                }
              }}
            >
              기본 템플릿 다시 불러오기
            </button>
          </div>
          <div className="studio-field">
            <label htmlFor="studio-images">사진</label>
            <label className="studio-image-picker" htmlFor="studio-images">
              <strong>{isCompressing ? "사진 압축 중…" : "사진 선택하기"}</strong>
              <span>긴 변 1600px · WebP · 화질 82%로 자동 변환</span>
            </label>
            <input
              className="studio-file-input"
              id="studio-images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              disabled={isCompressing}
              onChange={(event) => {
                void addImages(event.target.files);
                event.target.value = "";
              }}
            />
            {images.length > 0 && (
              <div className="studio-image-list">
                {images.map((image) => (
                  <article key={image.id}>
                    <img src={image.previewUrl} alt="" />
                    <div>
                      <strong>{image.name}</strong>
                      <small>
                        {image.width}×{image.height} · {formatBytes(image.originalBytes)} → {formatBytes(image.compressedBytes)}
                      </small>
                    </div>
                    <button type="button" onClick={() => insertImage(image)}>본문에 넣기</button>
                    <button type="button" onClick={() => downloadImage(image)}>받기</button>
                  </article>
                ))}
              </div>
            )}
          </div>
          <div className="studio-actions">
            <button type="button" onClick={copyMarkdown}>Markdown 복사</button>
            <button className="secondary-button" type="button" onClick={downloadMarkdown}>.md 내려받기</button>
            <a href={githubFolderUrl} target="_blank" rel="noreferrer">GitHub 저장 폴더 ↗</a>
            <button className="plain-button" type="button" onClick={resetDraft}>새 글로 비우기</button>
          </div>
          {message && <p className="studio-message" role="status">{message}</p>}
          <p className="studio-publish-note">
            <strong>{status === "published" ? "공개 글" : "초안"}</strong>
            {status === "published"
              ? "으로 GitHub에 저장하면 다음 배포부터 홈페이지에 나타납니다."
              : "은 GitHub에 저장해도 홈페이지 글 목록에는 나타나지 않습니다."}
          </p>
        </section>

        <aside className="studio-preview">
          <p className="panel-label">MARKDOWN PREVIEW</p>
          <pre>{markdown}</pre>
        </aside>
      </div>
    </div>
  );
}
