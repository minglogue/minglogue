import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StudioEditor } from "@/components/studio-editor";
import { formatPostDate, getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Studio",
  description: "Minglogue의 Markdown 글 작성 공간.",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  const posts = getAllPosts();

  return (
    <main>
      <SiteHeader />
      <section className="studio-hero page-shell">
        <div>
          <p className="eyebrow">MINGDDI&apos;S STUDIO</p>
          <h1>글을 쓰고,<br /><span>Markdown으로 챙겨가기.</span></h1>
        </div>
        <p>
          이 페이지에서는 블로그용 Markdown을 만들 수 있어요. 아직 로그인
          보호를 붙이기 전이라 GitHub 직접 저장 대신 복사와 파일 내려받기를
          제공합니다.
        </p>
      </section>
      <section className="studio-content page-shell">
        <div className="studio-post-manager">
          <div className="archive-heading">
            <h2>현재 공개된 글</h2>
            <span>{posts.length}개의 Markdown 파일</span>
          </div>
          <div className="studio-post-list">
            {posts.map((post) => (
              <article key={post.slug}>
                <div>
                  <span>{post.kind === "coding" ? "코딩" : "일상"}</span>
                  <h3>{post.title}</h3>
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </div>
                <div className="studio-post-actions">
                  <a href={`/posts/${post.slug}`} target="_blank" rel="noreferrer">
                    글 보기
                  </a>
                  <a
                    href={`https://github.com/popcorn-kim/minglogue/edit/main/content/${post.kind}/${post.slug}.md`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub에서 수정 ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <StudioEditor />
      </section>
      <SiteFooter />
    </main>
  );
}
