"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/lib/posts";
import { PostList } from "@/components/post-list";

type FilterablePostArchiveProps = {
  heading: string;
  posts: Post[];
};

export function FilterablePostArchive({
  heading,
  posts,
}: FilterablePostArchiveProps) {
  const [selectedTag, setSelectedTag] = useState("all");
  const [r2Posts, setR2Posts] = useState<Post[]>([]);
  useEffect(() => {
    void fetch("/api/public/posts", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return [];
        const result = await response.json() as { posts?: Array<{ slug: string; title: string; excerpt: string; date: string; category: string; tags: string; kind: Post["kind"]; body: string; }> };
        return (result.posts ?? []).map((post): Post => ({
          ...post,
          tags: post.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          readTime: `${Math.max(1, Math.ceil(post.body.replace(/\s/g, "").length / 500))}분`,
          content: post.body,
        }));
      })
      .then(setR2Posts)
      .catch(() => setR2Posts([]));
  }, []);
  const allPosts = useMemo(
    () => [...r2Posts, ...posts.filter((post) => !r2Posts.some((r2) => r2.slug === post.slug))]
      .sort((a, b) => b.date.localeCompare(a.date)),
    [posts, r2Posts],
  );
  const tags = useMemo(
    () =>
      [...new Set(allPosts.flatMap((post) => post.tags))].sort((a, b) =>
        a.localeCompare(b, "ko"),
      ),
    [allPosts],
  );
  const visiblePosts =
    selectedTag === "all"
      ? allPosts
      : allPosts.filter((post) => post.tags.includes(selectedTag));

  return (
    <>
      <section className="archive-filter page-shell" aria-label="태그별 기록 필터">
        <p>FILTER BY TAG</p>
        <div className="archive-filter-buttons">
          <button
            className={selectedTag === "all" ? "is-active" : ""}
            type="button"
            aria-pressed={selectedTag === "all"}
            onClick={() => setSelectedTag("all")}
          >
            전체 <span>{allPosts.length}</span>
          </button>
          {tags.map((tag) => {
            const count = allPosts.filter((post) => post.tags.includes(tag)).length;

            return (
              <button
                className={selectedTag === tag ? "is-active" : ""}
                type="button"
                aria-pressed={selectedTag === tag}
                onClick={() => setSelectedTag(tag)}
                key={tag}
              >
                #{tag} <span>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="archive-content page-shell">
        <div className="archive-heading">
          <h2>{selectedTag === "all" ? heading : `#${selectedTag}`}</h2>
          <span>{visiblePosts.length}개의 기록</span>
        </div>
        <PostList posts={visiblePosts} allPosts={allPosts} />
        {visiblePosts.length === 0 && (
          <p className="archive-empty">이 태그로 작성된 기록이 아직 없습니다.</p>
        )}
      </section>
    </>
  );
}
