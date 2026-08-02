"use client";

import { useMemo, useState } from "react";
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
  const tags = useMemo(
    () =>
      [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) =>
        a.localeCompare(b, "ko"),
      ),
    [posts],
  );
  const visiblePosts =
    selectedTag === "all"
      ? posts
      : posts.filter((post) => post.tags.includes(selectedTag));

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
            전체 <span>{posts.length}</span>
          </button>
          {tags.map((tag) => {
            const count = posts.filter((post) => post.tags.includes(tag)).length;

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
        <PostList posts={visiblePosts} allPosts={posts} />
        {visiblePosts.length === 0 && (
          <p className="archive-empty">이 태그로 작성된 기록이 아직 없습니다.</p>
        )}
      </section>
    </>
  );
}
