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
            <p className="archive-category">{post.category}</p>
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
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

