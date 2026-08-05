import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { MarkdownImage } from "@/components/zoomable-image";
import { PostViewTracker } from "@/components/view-count";
import { formatPostDate, getPostBySlug } from "@/lib/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <SiteHeader />
      <article className="post-page page-shell">
        <header className="post-page-header">
          <Link href={post.kind === "coding" ? "/coding" : "/daily"}>
            ← {post.kind === "coding" ? "STUDY LOGS" : "DAILY NOTES"}
          </Link>
          <p className="post-page-category">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="post-page-excerpt">{post.excerpt}</p>
          <div className="post-page-meta">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span>{post.readTime} 읽기</span>
            <span>by MINGDDI</span>
            <PostViewTracker slug={post.slug} />
          </div>
        </header>
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{ img: MarkdownImage }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        <footer className="post-page-end">
          <span>END OF LOG</span>
          <Link href={post.kind === "coding" ? "/coding" : "/daily"}>
            목록으로 돌아가기 →
          </Link>
        </footer>
      </article>
      <SiteFooter />
    </main>
  );
}
