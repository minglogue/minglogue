import Link from "next/link";
import { formatPostDate, type Post } from "@/lib/posts";
import { ViewCount } from "@/components/view-count";

export function PostList({
  posts,
  allPosts = posts,
}: {
  posts: Post[];
  allPosts?: Post[];
}) {
  const chronologicalPosts = [...allPosts].sort(
    (a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug),
  );

  return (
    <div className="archive-list">
      {posts.map((post) => (
        <article className="archive-row" key={post.slug}>
          <span className="archive-number">
            {String(
              chronologicalPosts.findIndex((item) => item.slug === post.slug) + 1,
            ).padStart(2, "0")}
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
            <span>{post.readTime} 읽기 · <ViewCount slug={post.slug} /></span>
          </div>
        </article>
      ))}
    </div>
  );
}
