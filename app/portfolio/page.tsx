import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllProjects } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Mingventory",
  description: "밍띠가 직접 기획하고 만들며 배운 프로젝트를 소개하는 밍벤토리입니다.",
};

export default function PortfolioPage() {
  const projects = getAllProjects();

  return (
    <main>
      <SiteHeader />
      <section className="portfolio-hero page-shell">
        <p className="eyebrow">MINGVENTORY</p>
        <h1 className="pixel-copy">
          배운 것을 <span>결과로</span>
          <br />
          남깁니다.
        </h1>
        <p>
          완성된 화면뿐 아니라, 무엇을 고민하고 어떻게 해결했는지 함께
          기록합니다.
        </p>
      </section>

      <section className="portfolio-list page-shell">
        <div className="archive-heading">
          <h2>PROJECTS</h2>
          <span>{projects.length}개의 프로젝트</span>
        </div>
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <article className="portfolio-card" key={project.slug}>
              <Link
                className="portfolio-card-cover"
                href={`/portfolio/${project.slug}`}
                aria-label={`${project.title} 프로젝트 보기`}
              >
                {project.cover ? (
                  <img src={project.cover} alt={`${project.title} 대표 화면`} />
                ) : (
                  <span>PROJECT {String(index + 1).padStart(2, "0")}</span>
                )}
              </Link>
              <div className="portfolio-card-body">
                <p className="portfolio-card-number">
                  PROJECT {String(index + 1).padStart(2, "0")}
                </p>
                <h2>
                  <Link href={`/portfolio/${project.slug}`}>
                    {project.title}
                  </Link>
                </h2>
                <p>{project.excerpt}</p>
                <div className="portfolio-tools">
                  {project.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                <Link className="portfolio-card-link" href={`/portfolio/${project.slug}`}>
                  프로젝트 보기 <Arrow />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
