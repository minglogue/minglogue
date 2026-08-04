"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type R2Post = { title: string; excerpt: string; date: string; category: string; kind: "coding" | "daily"; body: string; };

function formatPostDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric" }).format(parsed);
}

export function R2PostPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<R2Post | null>(null);
  useEffect(() => { void fetch(`/api/public/posts/${encodeURIComponent(slug)}`, { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((r) => setPost(r?.post ?? null)).catch(() => setPost(null)); }, [slug]);
  if (!post) return <main className="page-shell"><p className="archive-empty">글을 불러오는 중입니다.</p></main>;
  const readMinutes = Math.max(1, Math.ceil(post.body.replace(/\s/g, "").length / 500));
  return <article className="post-page page-shell">
    <header className="post-page-header"><Link href={post.kind === "coding" ? "/coding" : "/daily"}>← {post.kind === "coding" ? "STUDY LOGS" : "DAILY NOTES"}</Link><p className="post-page-category">{post.category}</p><h1>{post.title}</h1><p className="post-page-excerpt">{post.excerpt}</p><div className="post-page-meta"><time dateTime={post.date}>{formatPostDate(post.date)}</time><span>약 {readMinutes}분 읽기</span><span>by MINGDDI</span></div></header>
    <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{post.body}</ReactMarkdown></div>
  </article>;
}
