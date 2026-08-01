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
  problem: string;
  solution: string;
  result: string;
  users: string;
  highlights: PortfolioHighlight[];
  process: PortfolioProcess[];
  gallery: PortfolioGalleryImage[];
  content: string;
};

export type PortfolioHighlight = {
  title: string;
  description: string;
};

export type PortfolioProcess = {
  label: string;
  title: string;
  description: string;
};

export type PortfolioGalleryImage = {
  src: string;
  alt: string;
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

function resolveMedia(fileName: string) {
  const normalizedName = fileName.trim().replace(/^\.\//, "");
  const mediaPath = Object.keys(mediaFiles).find(
    (path) => path.split("/").pop() === normalizedName,
  );

  return mediaPath ? mediaFiles[mediaPath] : null;
}

function numberedHighlights(frontmatter: string) {
  return Array.from({ length: 8 }, (_, index) => index + 1)
    .map((number) => ({
      title: scalar(frontmatter, `highlight${number}Title`),
      description: scalar(frontmatter, `highlight${number}Description`),
    }))
    .filter((item) => item.title);
}

function numberedProcess(frontmatter: string) {
  return Array.from({ length: 8 }, (_, index) => index + 1)
    .map((number) => ({
      label: scalar(frontmatter, `process${number}Label`),
      title: scalar(frontmatter, `process${number}Title`),
      description: scalar(frontmatter, `process${number}Description`),
    }))
    .filter((item) => item.title);
}

function numberedGallery(frontmatter: string) {
  return Array.from({ length: 8 }, (_, index) => index + 1).flatMap(
    (number) => {
      const fileName = scalar(frontmatter, `gallery${number}Image`);
      const alt = scalar(frontmatter, `gallery${number}Alt`);
      const src = resolveMedia(fileName);

      return src ? [{ src, alt: alt || fileName }] : [];
    },
  );
}

function parseProject(path: string, raw: string): PortfolioProject {
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = frontmatterMatch?.[1] ?? "";
  const coverName = scalar(frontmatter, "cover").replace(/^\.\//, "");
  const legacyHighlights = list(frontmatter, "highlights").map((item) => {
    const [title, description = ""] = item.split("|").map((part) => part.trim());
    return { title, description };
  });
  const legacyProcess = list(frontmatter, "process").map((item) => {
    const [label, title = "", description = ""] = item
      .split("|")
      .map((part) => part.trim());
    return { label, title, description };
  });
  const legacyGallery = list(frontmatter, "gallery").flatMap((item) => {
    const [fileName, alt = ""] = item.split("|").map((part) => part.trim());
    const src = resolveMedia(fileName);
    return src ? [{ src, alt: alt || fileName }] : [];
  });

  return {
    slug: path.split("/").pop()?.replace(/^\d+-/, "").replace(/\.md$/, "") ?? "",
    title: scalar(frontmatter, "title"),
    excerpt: scalar(frontmatter, "excerpt"),
    period: scalar(frontmatter, "period"),
    role: scalar(frontmatter, "role"),
    contribution: scalar(frontmatter, "contribution"),
    tools: list(frontmatter, "tools"),
    cover: resolveMedia(coverName),
    featured: scalar(frontmatter, "featured") === "true",
    published: scalar(frontmatter, "published") !== "false",
    projectUrl: scalar(frontmatter, "projectUrl"),
    githubUrl: scalar(frontmatter, "githubUrl"),
    problem: scalar(frontmatter, "problem"),
    solution: scalar(frontmatter, "solution"),
    result: scalar(frontmatter, "result"),
    users: scalar(frontmatter, "users"),
    highlights: numberedHighlights(frontmatter).length
      ? numberedHighlights(frontmatter)
      : legacyHighlights,
    process: numberedProcess(frontmatter).length
      ? numberedProcess(frontmatter)
      : legacyProcess,
    gallery: numberedGallery(frontmatter).length
      ? numberedGallery(frontmatter)
      : legacyGallery,
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
