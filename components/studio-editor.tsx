"use client";

import { useEffect, useMemo, useState } from "react";

type PostKind = "coding" | "daily";
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
};

const STORAGE_KEY = "minglogue-studio-draft-v2";
const INITIAL_BODY = "# 오늘 배운 것\n\n여기에 내용을 적어보세요.";

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
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false);

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
  }, [body, category, date, excerpt, kind, readMinutes, tagList, title]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<StudioDraft>;
        setTitle(draft.title ?? "");
        setSlug(draft.slug ?? "");
        setKind(draft.kind === "daily" ? "daily" : "coding");
        setStatus(draft.status === "published" ? "published" : "drafts");
        setCategory(draft.category ?? "NEXT.JS");
        setExcerpt(draft.excerpt ?? "");
        setTags(draft.tags ?? "");
        setBody(draft.body ?? INITIAL_BODY);
        setDate(draft.date ?? today());
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
      title, slug, kind, status, category, excerpt, tags, body, date,
    };
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }, 350);

    return () => window.clearTimeout(timer);
  }, [body, category, date, excerpt, isReady, kind, slug, status, tags, title]);

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
              <select id="studio-kind" value={kind} onChange={(event) => setKind(event.target.value as PostKind)}>
                <option value="coding">궁금했던 것들</option>
                <option value="daily">일상 이야기</option>
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
          <div className="studio-field">
            <label htmlFor="studio-body">본문</label>
            <textarea id="studio-body" value={body} onChange={(event) => setBody(event.target.value)} />
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
