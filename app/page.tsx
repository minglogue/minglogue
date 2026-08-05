import Link from "next/link";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { CredlyBadge } from "@/components/credly-badge";
import { PopularPosts } from "@/components/popular-posts";
import { ViewCount } from "@/components/view-count";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/portfolio";
import { getPuddingPosts } from "@/lib/pudding";

function shortDate(date: string) {
  return date.slice(5).replace("-", ".");
}

export default function Home() {
  const codingPosts = getAllPosts("coding");
  const posts = codingPosts.slice(0, 5);
  const dailyNotes = getAllPosts("daily").slice(0, 5);
  const latestPudding = getPuddingPosts()[0];
  const projects = getAllProjects();
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const latestLogNumber = codingPosts[0]?.slug.match(/^(\d{4})/)?.[1] ?? "0000";
  const popularSources = [...codingPosts, ...getAllPosts("daily")].map(({ slug, title, kind }) => ({ slug, title, kind }));

  return (
    <main>
      <SiteHeader />

      <section className="hero page-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">DESIGNER BY DAY · DEVELOPER IN PROGRESS</p>
          <h1 className="pixel-copy">IT공부<span>•</span>일상기록</h1>
          <p className="hero-intro">
            궁금한건 정말 참을 수 없어
          </p>
          <Link className="text-link" href="/coding">최근 기록 읽기 <span>→</span></Link>
        </div>
        <aside className="issue-card" aria-label="이번 주 추천 글">
          <p>THIS WEEK&apos;S LOG</p>
          <strong className="pixel-copy">#{latestLogNumber}</strong>
          <Link href={`/posts/${posts[0]?.slug ?? ""}`}>
            {posts[0]?.title ?? "첫 기록을 준비하고 있습니다."} <Arrow />
          </Link>
        </aside>
      </section>

      <section className="content-grid page-shell" id="coding">
        <div className="home-feed">
          <section>
            <Link className="section-heading section-heading-link" href="/coding">
            <h2 className="pixel-copy">공부기록보기</h2>
              <span>전체 보기 →</span>
            </Link>
            <div className="post-list">
              {posts.map((post) => (
                <article className="post-row" key={post.title}>
                  <div className="post-category">{post.category}</div>
                  <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <div className="post-row-meta">
                    <time dateTime={post.date}>{shortDate(post.date)}</time>
                    <ViewCount slug={post.slug} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="home-daily-section" id="daily">
            <Link className="section-heading section-heading-link" href="/daily">
              <h2 className="pixel-copy">일상구경하기</h2>
              <span>전체 보기 →</span>
            </Link>
            <div className="post-list">
              {dailyNotes.map((post) => (
                <article className="post-row" key={post.slug}>
                  <div className="post-category">{post.category}</div>
                  <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <div className="post-row-meta">
                    <time dateTime={post.date}>{shortDate(post.date)}</time>
                    <ViewCount slug={post.slug} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="pudding-home" id="pudding">
          <img
            className="pudding-avatar"
            src="/pudding-avatar.png"
            alt="크림색 몸에 갈색 귀와 분홍 코를 가진 푸딩이 픽셀 캐릭터"
          />
          <div>
            <p className="panel-label">PUDDING&apos;S LATEST</p>
            <h2 className="pixel-copy">푸딩이의 최신 근황</h2>
            <p>{latestPudding?.content || "첫 번째 푸딩이 사진을 기다리고 있습니다."}</p>
          </div>
          <Link href="/pudding">사진 보러가기 <span>→</span></Link>
        </aside>
      </section>

      <PopularPosts posts={popularSources} />

      <section className="home-profile-grid page-shell">
        <section className="badge-section" id="badges">
          <p className="panel-label">CERTIFICATIONS</p>
          <h2 className="pixel-copy">지금까지 취득한 것들</h2>
          <p>IT관련 공부할 것들과 공부한 것들을 모읍니다.</p>
          <CredlyBadge />
        </section>
        <section className="portfolio-section" id="portfolio">
          <p className="panel-label">MINGVENTORY</p>
          <h2 className="pixel-copy">배운 것을 결과로 남깁니다.</h2>
          <p>프로젝트의 과정, 역할, 기여도를 기록합니다.</p>
          {featuredProject && (
            <Link
              className="home-featured-project"
              href={`/portfolio/${featuredProject.slug}`}
              aria-label={`${featuredProject.title} 대표 프로젝트 보기`}
            >
              {featuredProject.cover && (
                <img src={featuredProject.cover} alt={`${featuredProject.title} 대표 화면`} />
              )}
              <span>
                <strong>{featuredProject.title}</strong>
                <small>{featuredProject.excerpt}</small>
              </span>
            </Link>
          )}
          <Link className="portfolio-more-link" href="/portfolio">
            밍벤토리 보기 <Arrow />
          </Link>
        </section>
      </section>

      <SiteFooter />
    </main>
  );
}
