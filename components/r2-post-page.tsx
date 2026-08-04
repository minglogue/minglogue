"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type R2Post = { title: string; excerpt: string; date: string; category: string; kind: "coding" | "daily"; body: string; };

export function R2PostPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<R2Post | null>(null);
  useEffect(() => { void fetch(`/api/public/posts/${encodeURIComponent(slug)}`, { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((r) => setPost(r?.post ?? null)).catch(() => setPost(null)); }, [slug]);
  if (!post) return <main className="page-shell"><p className="archive-empty">글을 불러오는 중입니다.</p></main>;
  return <article className="post-page page-shell">
    <header className="post-page-header"><Link href={post.kind === "coding" ? "/coding" : "/daily"}>← 목록으로</Link><p className="post-page-category">{post.category}</p><h1>{post.title}</h1><p className="post-page-excerpt">{post.excerpt}</p><time dateTime={post.date}>{post.date}</time></header>
    <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{post.body}</ReactMarkdown></div>
  </article>;
}
