import Link from "next/link";

export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export function SiteHeader() {
  return (
    <header className="site-header page-shell">
      <Link className="brand" href="/" aria-label="Minglogue 홈">
        <span className="brand-dot" aria-hidden="true" />
        Minglogue
      </Link>
      <nav className="main-nav" aria-label="주요 메뉴">
        <Link href="/coding">Coding Logs</Link>
        <Link href="/daily">Daily</Link>
        <Link href="/pudding">Pudding</Link>
        <Link href="/#badges">Badges</Link>
        <Link href="/portfolio">Mingventory</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer page-shell">
      <div>
        <strong>Minglogue</strong>
        <p>Designed, coded and continuously learned by Mingddi.</p>
      </div>
      <div className="footer-links">
        <a
          href="https://github.com/minglogue/minglogue"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <Link href="/studio">Studio</Link>
        <Link href="/portfolio">Mingventory</Link>
        <Link href="/">홈으로 ↑</Link>
      </div>
    </footer>
  );
}
