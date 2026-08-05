import type { Metadata } from "next";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "공부 기록",
  description: "직접 배우고 부딪히며 남긴 공부 기록",
};

export default function CodingPage() {
  const posts = getAllPosts("coding");

  return (
    <main>
      <SiteHeader />
      <section className="archive-hero page-shell">
        <p className="eyebrow">STUDY LOGS</p>
        <h1 className="pixel-copy">
          궁금했던 <span>것들</span>
        </h1>
        <p>
          한 땀 한 땀 머릿 속에 넣는 용도입니다.
        </p>
      </section>
      <FilterablePostArchive heading="ALL STUDY LOGS" posts={posts} />
      <SiteFooter />
    </main>
  );
}
