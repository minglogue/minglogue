import Link from "next/link";
import { formatPostDate, type Post } from "@/lib/posts";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="archive-list">
      {posts.map((post, index) => (
        <article className="archive-row" key={post.slug}>
          <span className="archive-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.kind === "coding" ? (
              <div className="archive-taxonomy" aria-label="카테고리">
                <span className="archive-chip">{post.category}</span>
              </div>
            ) : post.tags.length > 0 ? (
              <div className="archive-taxonomy" aria-label="태그">
                {post.tags.map((tag) => (
                  <span className="archive-chip" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            <p>{post.excerpt}</p>
          </div>
          <div className="archive-meta">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span>{post.readTime} 읽기</span>
          </div>
        </article>
      ))}
    </div>
  );
}
