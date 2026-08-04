import type { Metadata } from "next";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts, getPublishedR2Posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "일상 기록",
  description: "공부와 디자인 사이에서 건져 올린 밍띠의 일상 기록.",
};

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const localPosts = getAllPosts("daily");
  const r2Posts = (await getPublishedR2Posts()).filter((post) => post.kind === "daily");
  const posts = [...r2Posts, ...localPosts.filter((post) => !r2Posts.some((r2) => r2.slug === post.slug))]
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <SiteHeader />
      <section className="archive-hero daily-archive-hero page-shell">
        <p className="eyebrow">DAILY NOTES</p>
        <h1 className="pixel-copy">
          일상<span>이야기</span>
        </h1>
        <p>공부와 디자인 사이에서 발견한 생각과 일상의 조각입니다.</p>
      </section>
      <FilterablePostArchive heading="ALL DAILY NOTES" posts={posts} />
      <SiteFooter />
    </main>
  );
}
