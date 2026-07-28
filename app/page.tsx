import Link from "next/link";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";

function shortDate(date: string) {
  return date.slice(5).replace("-", ".");
}

export default function Home() {
  const posts = getAllPosts("coding").slice(0, 3);
  const dailyNotes = getAllPosts("daily").slice(0, 3);

  return (
    <main>
      <SiteHeader />

      <section className="hero page-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">DESIGNER BY DAY · DEVELOPER IN PROGRESS</p>
          <h1>
            궁금해서 파봤고,
            <br />
            <span>까먹기 전에</span> 적어둡니다.
          </h1>
          <p className="hero-intro">
            팝콘이 배우고 만들고 실패한 모든 것을 기록합니다.
            <br />
            보기에는 말랑하지만 내용은 꽤 깊습니다.
          </p>
          <Link className="text-link" href="/coding">최근 기록 읽기 <span>→</span></Link>
        </div>
        <aside className="issue-card" aria-label="이번 주 추천 글">
          <p>THIS WEEK&apos;S LOG</p>
          <strong># 024</strong>
          <Link href={`/posts/${posts[0]?.slug ?? ""}`}>
            {posts[0]?.title ?? "첫 기록을 준비하고 있습니다."} <Arrow />
          </Link>
        </aside>
      </section>

      <section className="content-grid page-shell" id="coding">
        <div>
          <div className="section-heading">
            <h2>RECENT CODING LOGS</h2>
            <Link href="/coding">전체 보기 <span>→</span></Link>
          </div>
          <div className="post-list">
            {posts.map((post) => (
              <article className="post-row" key={post.title}>
                <div className="post-category">{post.category}</div>
                <div>
                  <h3><Link href={`/posts/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <span className="post-read-time">{post.readTime} 읽기</span>
                </div>
                <time dateTime={post.date}>{shortDate(post.date)}</time>
              </article>
            ))}
          </div>
        </div>

        <aside className="learning-panel">
          <p className="panel-label">NOW LEARNING</p>
          <pre aria-label="현재 공부하고 있는 내용"><code><span>const</span> popcorn = {"{"}
{"\n"}  focus: &quot;Next.js&quot;,
{"\n"}  streak: 42,
{"\n"}  mood: &quot;curious&quot;
{"\n"}{"}"}</code></pre>
          <div className="pudding-mini" id="pudding">
            <div className="hamster" aria-hidden="true">
              <i /><i /><b>••</b>
            </div>
            <div>
              <h3>푸딩이의 오늘</h3>
              <p>해바라기씨를 숨긴 위치를 또 잊어버렸습니다.</p>
              <a href="#pudding">푸딩이 공간 준비 중 <span>→</span></a>
            </div>
          </div>
        </aside>
      </section>

      <section className="lower-sections page-shell">
        <div className="daily-section" id="daily">
          <div className="section-heading">
            <h2>DAILY NOTES</h2>
            <span>생각과 일상의 조각</span>
          </div>
          {dailyNotes.map((post) => (
            <Link className="daily-row" href={`/posts/${post.slug}`} key={post.slug}>
              <time dateTime={post.date}>{shortDate(post.date)}</time>
              <span>{post.title}</span>
              <b>→</b>
            </Link>
          ))}
        </div>

        <div className="profile-column">
          <section className="badge-section" id="badges">
            <p className="panel-label">CERTIFICATIONS</p>
            <h2>배운 것을 증명하는 배지</h2>
            <p>자격증과 디지털 배지를 연결할 자리입니다.</p>
            <span className="coming-label">BADGES COMING SOON</span>
          </section>
          <section className="portfolio-section" id="portfolio">
            <p className="panel-label">SELECTED WORK</p>
            <h2>문제를 예쁘고 단단하게 해결합니다.</h2>
            <p>팝콘의 디자인과 개발 프로젝트를 소개할 공간입니다.</p>
            <a
              href="https://popcorn-kim.github.io/"
              target="_blank"
              rel="noreferrer"
            >
              포트폴리오 보기 <Arrow />
            </a>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
