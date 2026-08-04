"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/lib/posts";

function shortDate(date: string) {
  return date.slice(5).replace("-", ".");
}

function Row({ post }: { post: Post }) {
  return <article className="post-row">
    <div className="post-category">{post.category}</div>
    <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
    <p>{post.excerpt}</p>
    <time dateTime={post.date}>{shortDate(post.date)}</time>
  </article>;
}

export function HomeR2PostLists({ coding, daily }: { coding: Post[]; daily: Post[] }) {
  const [r2Posts, setR2Posts] = useState<Post[]>([]);
  useEffect(() => {
    void fetch("/api/public/posts", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return [];
        const result = await response.json() as { posts?: Array<{ slug: string; title: string; excerpt: string; date: string; category: string; tags: string; kind: Post["kind"]; body: string; }> };
        return (result.posts ?? []).map((post): Post => ({ ...post, tags: post.tags.split(",").map((tag) => tag.trim()).filter(Boolean), readTime: `${Math.max(1, Math.ceil(post.body.replace(/\s/g, "").length / 500))}분`, content: post.body }));
      })
      .then(setR2Posts)
      .catch(() => setR2Posts([]));
  }, []);
  const merge = (local: Post[], kind: Post["kind"]) => [...r2Posts.filter((post) => post.kind === kind), ...local.filter((post) => !r2Posts.some((r2) => r2.slug === post.slug))].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const codingPosts = useMemo(() => merge(coding, "coding"), [coding, r2Posts]);
  const dailyPosts = useMemo(() => merge(daily, "daily"), [daily, r2Posts]);
  return <div className="home-feed">
    <section>
      <Link className="section-heading section-heading-link" href="/coding"><h2 className="pixel-copy">공부기록보기</h2><span>전체 보기 →</span></Link>
      <div className="post-list">{codingPosts.map((post) => <Row key={post.slug} post={post} />)}</div>
    </section>
    <section className="home-daily-section" id="daily">
      <Link className="section-heading section-heading-link" href="/daily"><h2 className="pixel-copy">일상구경하기</h2><span>전체 보기 →</span></Link>
      <div className="post-list">{dailyPosts.map((post) => <Row key={post.slug} post={post} />)}</div>
    </section>
  </div>;
}
