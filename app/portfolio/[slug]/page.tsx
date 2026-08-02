import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Arrow, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getProjectBySlug } from "@/lib/portfolio";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "프로젝트를 찾을 수 없습니다" };
  }

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: project.cover ? [project.cover] : [],
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <SiteHeader />
      <article className="portfolio-detail page-shell">
        <header className="portfolio-detail-header">
          <Link href="/portfolio">← MINGVENTORY</Link>
          <p className="eyebrow">PROJECT CASE STUDY</p>
          <h1 className="pixel-copy">{project.title}</h1>
          <p className="portfolio-detail-excerpt">{project.excerpt}</p>
          <dl className="portfolio-facts">
            <div>
              <dt>PERIOD</dt>
              <dd>{project.period}</dd>
            </div>
            <div>
              <dt>CONTRIBUTION</dt>
              <dd>{project.contribution}</dd>
            </div>
            <div>
              <dt>ROLE</dt>
              <dd>{project.role}</dd>
            </div>
            {project.users && (
              <div>
                <dt>FOR</dt>
                <dd>{project.users}</dd>
              </div>
            )}
          </dl>
          <div className="portfolio-detail-actions">
            {project.projectUrl && (
              <a href={project.projectUrl} target="_blank" rel="noreferrer">
                사이트 방문 <Arrow />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                GitHub <Arrow />
              </a>
            )}
          </div>
        </header>

        {project.cover && (
          <figure className="portfolio-detail-cover">
            <img src={project.cover} alt={`${project.title} 대표 화면`} />
          </figure>
        )}

        <div className="portfolio-detail-layout">
          <aside className="portfolio-detail-tools">
            <p>TOOLS</p>
            <ul>
              {project.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </aside>

          {(project.problem || project.solution) && (
            <section className="portfolio-overview" aria-label="문제와 해결">
              <article>
                <p>01 / PROBLEM</p>
                <h2>프로젝트 목적</h2>
                <div className="portfolio-rich-copy">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.problem}</ReactMarkdown>
                </div>
              </article>
              <article>
                <p>02 / SOLUTION</p>
                <h2>해결방법</h2>
                <div className="portfolio-rich-copy">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.solution}</ReactMarkdown>
                </div>
              </article>
            </section>
          )}

          {project.result && (
            <section className="portfolio-result">
              <p>PROJECT RESULT</p>
              <h2>최종 결과</h2>
              <div className="portfolio-result-copy">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.result}</ReactMarkdown>
              </div>
            </section>
          )}

          {project.highlights.length > 0 && (
            <section className="portfolio-visual-section">
              <div className="portfolio-section-heading">
                <p>HIGHLIGHTS</p>
                <h2>핵심 결과</h2>
              </div>
              <div className="portfolio-highlight-grid">
                {project.highlights.map((highlight, index) => (
                  <article key={`${highlight.title}-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{highlight.title}</h3>
                    <div className="portfolio-rich-copy">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{highlight.description}</ReactMarkdown>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {project.process.length > 0 && (
            <section className="portfolio-visual-section">
              <div className="portfolio-section-heading">
                <p>PROCESS</p>
                <h2>만든 과정</h2>
              </div>
              <div className="portfolio-process-grid">
                {project.process.map((step, index) => (
                  <article key={`${step.label}-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")} / {step.label}</span>
                    <h3>{step.title}</h3>
                    <div className="portfolio-rich-copy">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.description}</ReactMarkdown>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {project.gallery.length > 0 && (
            <section className="portfolio-visual-section">
              <div className="portfolio-section-heading">
                <p>SCREENS</p>
                <h2>실제 화면</h2>
              </div>
              <div className="portfolio-gallery">
                {project.gallery.map((image, index) => (
                  <figure key={`${image.src}-${index}`}>
                    <img src={image.src} alt={image.alt} />
                    <figcaption>{image.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {project.content && (
            <section className="portfolio-deep-dive">
              <div className="portfolio-section-heading">
                <p>DEEP DIVE</p>
                <h2>조금 더 자세한 기록</h2>
              </div>
              <div className="markdown-body portfolio-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.content}
                </ReactMarkdown>
              </div>
            </section>
          )}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
