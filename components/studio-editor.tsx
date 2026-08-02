"use client";

import { useMemo, useState } from "react";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function StudioEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [kind, setKind] = useState<"coding" | "daily">("coding");
  const [category, setCategory] = useState("NEXT.JS");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("# 오늘 배운 것\n\n여기에 내용을 적어보세요.");
  const [message, setMessage] = useState("");
  const date = new Date().toISOString().slice(0, 10);

  const safeSlug = slugify(slug || title) || "new-post";
  const markdown = useMemo(
    () => `---
title: "${title.replaceAll('"', '\\"') || "새 글 제목"}"
excerpt: "${excerpt.replaceAll('"', '\\"')}"
date: "${date}"
category: "${category.replaceAll('"', '\\"')}"
kind: "${kind}"
readTime: "3분"
---

${body}
`,
    [body, category, date, excerpt, kind, title],
  );

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setMessage("Markdown을 복사했어요. GitHub 새 파일 화면에 붙여넣으세요.");
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

  return (
    <div className="studio-grid" id="new-post">
      <section className="studio-form" aria-label="Markdown 글 작성">
        <div className="studio-field">
          <label htmlFor="studio-title">제목</label>
          <input
            id="studio-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="오늘 배운 것을 한 문장으로"
          />
        </div>
        <div className="studio-form-row">
          <div className="studio-field">
            <label htmlFor="studio-kind">글 종류</label>
            <select
              id="studio-kind"
              value={kind}
              onChange={(event) =>
                setKind(event.target.value as "coding" | "daily")
              }
            >
              <option value="coding">코딩 기록</option>
              <option value="daily">일상 기록</option>
            </select>
          </div>
          <div className="studio-field">
            <label htmlFor="studio-category">카테고리</label>
            <input
              id="studio-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </div>
        </div>
        <div className="studio-field">
          <label htmlFor="studio-slug">파일 이름</label>
          <input
            id="studio-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder={safeSlug}
          />
          <small>{safeSlug}.md로 저장됩니다.</small>
        </div>
        <div className="studio-field">
          <label htmlFor="studio-excerpt">한 줄 설명</label>
          <input
            id="studio-excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            placeholder="글 목록에 보일 짧은 설명"
          />
        </div>
        <div className="studio-field">
          <label htmlFor="studio-body">본문</label>
          <textarea
            id="studio-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </div>
        <div className="studio-actions">
          <button type="button" onClick={copyMarkdown}>
            Markdown 복사
          </button>
          <button className="secondary-button" type="button" onClick={downloadMarkdown}>
            .md 내려받기
          </button>
          <a
            href={`https://github.com/popcorn-kim/minglogue/tree/main/content/${kind}`}
            target="_blank"
            rel="noreferrer"
          >
            GitHub 글 폴더 열기 ↗
          </a>
        </div>
        {message && <p className="studio-message" role="status">{message}</p>}
      </section>

      <aside className="studio-preview">
        <p className="panel-label">MARKDOWN PREVIEW</p>
        <pre>{markdown}</pre>
      </aside>
    </div>
  );
}
