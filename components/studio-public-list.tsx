"use client";

import { useState } from "react";
import { formatPostDate, type Post } from "@/lib/posts";

const PAGE_SIZE = 10;

export function StudioPublicList({ posts }: { posts: Post[] }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const visiblePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="studio-post-list">
        {visiblePosts.map((post) => (
          <article key={post.slug}>
            <div className="studio-post-summary">
              <span>{post.kind === "coding" ? "공부" : "일상"}</span>
              <h3>{post.title}</h3>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            </div>
            <div className="studio-post-actions">
              <a href={`/posts/${post.slug}`} target="_blank" rel="noreferrer">글 보기</a>
              <a href="#new-post">편집하기</a>
            </div>
          </article>
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="studio-pagination" aria-label="공개 글 페이지">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button key={number} type="button" className={number === page ? "active" : ""} onClick={() => setPage(number)} aria-current={number === page ? "page" : undefined}>
              {number}
            </button>
          ))}
        </nav>
      )}
    </>
  );
}
