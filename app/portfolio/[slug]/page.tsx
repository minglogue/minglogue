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
          <Link href="/portfolio">← PORTFOLIO</Link>
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
          <div className="markdown-body portfolio-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
