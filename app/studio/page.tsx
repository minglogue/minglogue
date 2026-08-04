import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StudioEditor } from "@/components/studio-editor";
import { StudioPublicList } from "@/components/studio-public-list";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "쓰는 공간",
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
          <p className="eyebrow">밍띠의 스튜디오</p>
          <h1 className="pixel-copy"><span>쓰는 공간</span></h1>
        </div>
        <p>
          휴대폰과 컴퓨터에서 같은 글을 불러와 쓰고, R2에 초안 또는 공개
          상태로 저장하는 클라우드 편집 공간입니다.
        </p>
      </section>
      <section className="studio-content page-shell">
        <div className="studio-post-manager">
          <div className="archive-heading">
            <h2>현재 공개된 글</h2>
            <span>{posts.length}개의 Markdown 파일</span>
          </div>
          <StudioPublicList posts={posts} />
        </div>
        <StudioEditor />
      </section>
      <SiteFooter />
    </main>
  );
}
