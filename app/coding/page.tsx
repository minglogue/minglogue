import type { Metadata } from "next";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "코딩 기록",
  description: "밍띠가 직접 배우고 부딪히며 남긴 개발 공부 기록.",
};

export default function CodingPage() {
  const posts = getAllPosts("coding");

  return (
    <main>
      <SiteHeader />
      <section className="archive-hero page-shell">
        <p className="eyebrow">CODING LOGS</p>
        <h1 className="pixel-copy">
          분해해 본 <span>후기</span>
        </h1>
        <p>
          외워서 설명하기보다 직접 만들고 망가뜨리며 알게 된 것들을
          기록합니다.
        </p>
      </section>
      <FilterablePostArchive heading="ALL CODING LOGS" posts={posts} />
      <SiteFooter />
    </main>
  );
}
