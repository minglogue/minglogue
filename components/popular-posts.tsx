"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PopularSource = { slug: string; title: string; kind: "coding" | "daily" };
type PopularResult = { slug: string; views: number };

export function PopularPosts({ posts }: { posts: PopularSource[] }) {
  const [ranking, setRanking] = useState<PopularResult[]>([]);
  const postMap = useMemo(() => new Map(posts.map((post) => [post.slug, post])), [posts]);

  useEffect(() => {
    void fetch("/api/views/popular")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { posts?: PopularResult[] }) => setRanking(data.posts ?? []))
      .catch(() => setRanking([]));
  }, []);

  if (!ranking.length) return null;

  return (
    <section className="popular-posts page-shell" aria-labelledby="popular-posts-heading">
      <div className="section-heading">
        <h2 className="pixel-copy" id="popular-posts-heading">많이 읽은 기록</h2>
        <span>최근 30일</span>
      </div>
      <ol>
        {ranking.map((item, index) => {
          const post = postMap.get(item.slug);
          if (!post) return null;

          return (
            <li key={item.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Link href={`/posts/${item.slug}`}>{post.title}</Link>
              <small>{post.kind === "coding" ? "공부" : "일상"} · 조회 {item.views}</small>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
