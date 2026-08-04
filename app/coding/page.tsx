import type { Metadata } from "next";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts, getPublishedR2Posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "공부 기록",
  description: "밍띠가 직접 배우고 부딪히며 남긴 개발 공부 기록.",
};

export default async function CodingPage() {
  const localPosts = getAllPosts("coding");
  const r2Posts = (await getPublishedR2Posts()).filter((post) => post.kind === "coding");
  const posts = [...r2Posts, ...localPosts.filter((post) => !r2Posts.some((r2) => r2.slug === post.slug))]
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main>
      <SiteHeader />
      <section className="archive-hero page-shell">
        <p className="eyebrow">STUDY LOGS</p>
        <h1 className="pixel-copy">
          궁금했던 <span>것들</span>
        </h1>
        <p>
          외워서 설명하기보다 직접 만들고 망가뜨리며 알게 된 것들을
          기록합니다.
        </p>
      </section>
      <FilterablePostArchive heading="ALL STUDY LOGS" posts={posts} />
      <SiteFooter />
    </main>
  );
}
