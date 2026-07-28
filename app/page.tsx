const posts = [
  {
    category: "REACT",
    title: "Server Component는 어디까지 서버일까?",
    summary: "경계를 직접 그려보며 이해한 렌더링 모델.",
    date: "07.24",
    readTime: "8분",
  },
  {
    category: "TYPESCRIPT",
    title: "타입 좁히기를 습관으로 만드는 법",
    summary: "복잡한 조건문을 읽기 좋은 타입으로 바꾸기.",
    date: "07.18",
    readTime: "6분",
  },
  {
    category: "DOCKER",
    title: "처음 만난 컨테이너의 벽",
    summary: "이미지, 레이어, 볼륨을 비유 없이 정리했다.",
    date: "07.09",
    readTime: "7분",
  },
];

const dailyNotes = [
  ["07.21", "새로운 것을 배우는 속도보다 기록하는 습관"],
  ["07.12", "작은 사이드 프로젝트를 끝내는 방법"],
  ["07.03", "디자이너가 개발을 배우며 달라진 시선"],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header page-shell">
        <a className="brand" href="#top" aria-label="PopcornKim's Logs 홈">
          <span className="brand-dot" aria-hidden="true" />
          PopcornKim&apos;s Logs
        </a>
        <nav className="main-nav" aria-label="주요 메뉴">
          <a href="#coding">Coding Logs</a>
          <a href="#daily">Daily</a>
          <a href="#pudding">Pudding</a>
          <a href="#badges">Badges</a>
          <a href="#portfolio">Portfolio <Arrow /></a>
        </nav>
      </header>

      <section className="hero page-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">DESIGNER BY DAY · DEVELOPER IN PROGRESS</p>
          <h1>
            귀여운 화면 뒤에는
            <br />
            <span>단단한 기록</span>이 있습니다.
          </h1>
          <p className="hero-intro">
            팝콘이 배우고 만들고 실패한 모든 것을 기록합니다.
            <br />
            보기에는 말랑하지만 내용은 꽤 깊습니다.
          </p>
          <a className="text-link" href="#coding">최근 기록 읽기 <span>↓</span></a>
        </div>
        <aside className="issue-card" aria-label="이번 주 추천 글">
          <p>THIS WEEK&apos;S LOG</p>
          <strong># 024</strong>
          <a href="#coding">React Server Components를 이해하는 가장 작은 단위 <Arrow /></a>
        </aside>
      </section>

      <section className="content-grid page-shell" id="coding">
        <div>
          <div className="section-heading">
            <h2>RECENT CODING LOGS</h2>
            <a href="#coding">전체 보기 <span>→</span></a>
          </div>
          <div className="post-list">
            {posts.map((post) => (
              <article className="post-row" key={post.title}>
                <div className="post-category">{post.category}</div>
                <div>
                  <h3><a href="#coding">{post.title}</a></h3>
                  <p>{post.summary}</p>
                  <span className="post-read-time">{post.readTime} 읽기</span>
                </div>
                <time>{post.date}</time>
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
          {dailyNotes.map(([date, title]) => (
            <a className="daily-row" href="#daily" key={title}>
              <time>{date}</time>
              <span>{title}</span>
              <b>→</b>
            </a>
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
            <a href="#portfolio">포트폴리오 준비 중 <Arrow /></a>
          </section>
        </div>
      </section>

      <footer className="site-footer page-shell">
        <div>
          <strong>PopcornKim&apos;s Logs</strong>
          <p>Designed, coded and continuously learned by 팝콘.</p>
        </div>
        <div className="footer-links">
          <a href="#top">GitHub</a>
          <a href="#pudding">Instagram</a>
          <a href="#top">맨 위로 ↑</a>
        </div>
      </footer>
    </main>
  );
}
