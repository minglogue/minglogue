import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { formatPostDate } from "@/lib/posts";
import { getPuddingPosts } from "@/lib/pudding";
import { ZoomableImage } from "@/components/zoomable-image";

export const metadata: Metadata = {
  title: "푸딩이의 최신 근황",
  description: "사진으로 모아보는 푸딩이 갤러리",
};

export default function PuddingPage() {
  const posts = getPuddingPosts();
  const moments = posts.flatMap((post) =>
    post.images.length
      ? post.images.map((image, index) => ({
          ...post,
          image,
          content: index === 0 ? post.content : "",
          momentKey: `${post.slug}-${index}`,
        }))
      : [{ ...post, image: null, momentKey: `${post.slug}-empty` }],
  );

  return (
    <main>
      <SiteHeader />
      <section className="pudding-hero page-shell">
        <div>
          <p className="eyebrow">PUDDING&apos;S GALLERY</p>
          <h1 className="pixel-copy">
            푸딩이의 <span>최신 근황</span>
          </h1>
          <p>2026.03.15 ~</p>
        </div>
        <img src="/pudding-avatar.png" alt="곱슬털 햄스터 푸딩이 픽셀 캐릭터" />
      </section>

      <section className="pudding-gallery page-shell">
        <div className="archive-heading">
          <h2>PUDDING MOMENTS</h2>
          <span>{moments.length}개의 순간</span>
        </div>
        {posts.length ? (
          <div className="pudding-grid">
            {moments.map((post) => (
              <article className="pudding-card" key={post.momentKey}>
                <div className={`pudding-photo${post.image ? "" : " is-placeholder"}`}>
                  <ZoomableImage
                    src={post.image ?? "/pudding-avatar.png"}
                    alt={post.tags.length ? `푸딩이: ${post.tags.join(", ")}` : "푸딩이 사진"}
                  />
                </div>
                <div className="pudding-card-meta">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <div className="pudding-tags">
                    {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                  </div>
                </div>
                {post.content && <p>{post.content}</p>}
              </article>
            ))}
          </div>
        ) : (
          <div className="pudding-empty">
            <img src="/pudding-avatar.png" alt="" />
            <p>첫 번째 푸딩이 사진을 기다리고 있습니다.</p>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
