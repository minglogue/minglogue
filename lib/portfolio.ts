export type PortfolioProject = {
  slug: string;
  title: string;
  excerpt: string;
  period: string;
  role: string;
  contribution: string;
  tools: string[];
  cover: string | null;
  featured: boolean;
  published: boolean;
  projectUrl: string;
  githubUrl: string;
  content: string;
};

const projectFiles = import.meta.glob("../content/portfolio/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const mediaFiles = import.meta.glob(
  "../content/media/*.{avif,gif,jpeg,jpg,png,webp}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

function scalar(frontmatter: string, key: string) {
  return (
    frontmatter
      .match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]
      ?.trim()
      .replace(/^["']|["']$/g, "") ?? ""
  );
}

function list(frontmatter: string, key: string) {
  const block =
    frontmatter.match(
      new RegExp(`^${key}:\\s*\\n((?:\\s+-\\s+.*\\n?)*)`, "m"),
    )?.[1] ?? "";

  return [...block.matchAll(/^\s+-\s+(.+)$/gm)].map((match) =>
    match[1].trim(),
  );
}

function parseProject(path: string, raw: string): PortfolioProject {
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = frontmatterMatch?.[1] ?? "";
  const coverName = scalar(frontmatter, "cover").replace(/^\.\//, "");
  const coverPath = Object.keys(mediaFiles).find(
    (mediaPath) => mediaPath.split("/").pop() === coverName,
  );

  return {
    slug: path.split("/").pop()?.replace(/^\d+-/, "").replace(/\.md$/, "") ?? "",
    title: scalar(frontmatter, "title"),
    excerpt: scalar(frontmatter, "excerpt"),
    period: scalar(frontmatter, "period"),
    role: scalar(frontmatter, "role"),
    contribution: scalar(frontmatter, "contribution"),
    tools: list(frontmatter, "tools"),
    cover: coverPath ? mediaFiles[coverPath] : null,
    featured: scalar(frontmatter, "featured") === "true",
    published: scalar(frontmatter, "published") !== "false",
    projectUrl: scalar(frontmatter, "projectUrl"),
    githubUrl: scalar(frontmatter, "githubUrl"),
    content: raw.slice(frontmatterMatch?.[0].length ?? 0).trim(),
  };
}

export function getAllProjects() {
  return Object.entries(projectFiles)
    .map(([path, raw]) => parseProject(path, raw))
    .filter((project) => project.published)
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function getProjectBySlug(slug: string) {
  return getAllProjects().find((project) => project.slug === slug);
}
