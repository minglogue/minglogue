import type { Metadata } from "next";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "일상 기록",
  description: "공부와 디자인 사이에서 건져 올린 밍띠의 일상 기록.",
};

export default function DailyPage() {
  const posts = getAllPosts("daily");

  return (
    <main>
      <SiteHeader />
      <section className="archive-hero daily-archive-hero page-shell">
        <p className="eyebrow">DAILY NOTES</p>
        <h1 className="pixel-copy">
          코딩 외의 <span>모든 이야기</span>
        </h1>
        <p>공부와 디자인 사이에서 발견한 생각과 일상의 조각입니다.</p>
      </section>
      <FilterablePostArchive heading="ALL DAILY NOTES" posts={posts} />
      <SiteFooter />
    </main>
  );
}
