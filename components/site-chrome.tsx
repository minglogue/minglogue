import Link from "next/link";

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function SiteHeader() {
  return (
    <header className="site-header page-shell">
      <Link className="brand" href="/" aria-label="PopcornKim's Logs 홈">
        <span className="brand-dot" aria-hidden="true" />
        PopcornKim&apos;s Logs
      </Link>
      <nav className="main-nav" aria-label="주요 메뉴">
        <Link href="/coding">Coding Logs</Link>
        <Link href="/daily">Daily</Link>
        <Link href="/#pudding">Pudding</Link>
        <Link href="/#badges">Badges</Link>
        <a href="https://popcorn-kim.github.io/" target="_blank" rel="noreferrer">
          Portfolio <Arrow />
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer page-shell">
      <div>
        <strong>PopcornKim&apos;s Logs</strong>
        <p>Designed, coded and continuously learned by 팝콘.</p>
      </div>
      <div className="footer-links">
        <a
          href="https://github.com/popcorn-kim/popcorn-kim-log"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <Link href="/studio">Studio</Link>
        <Link href="/">홈으로 ↑</Link>
      </div>
    </footer>
  );
}

