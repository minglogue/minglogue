import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StudioEditor } from "@/components/studio-editor";

export const metadata: Metadata = {
  title: "Studio",
  description: "PopcornKim's Logs의 Markdown 글 작성 공간.",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <main>
      <SiteHeader />
      <section className="studio-hero page-shell">
        <div>
          <p className="eyebrow">POPCORN&apos;S STUDIO</p>
          <h1>글을 쓰고,<br /><span>Markdown으로 챙겨가기.</span></h1>
        </div>
        <p>
          이 페이지에서는 블로그용 Markdown을 만들 수 있어요. 아직 로그인
          보호를 붙이기 전이라 GitHub 직접 저장 대신 복사와 파일 내려받기를
          제공합니다.
        </p>
      </section>
      <section className="studio-content page-shell">
        <StudioEditor />
      </section>
      <SiteFooter />
    </main>
  );
}

