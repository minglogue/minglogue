export type PostKind = "coding" | "daily";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  kind: PostKind;
  readTime: string;
  content: string;
};

const markdownFiles = import.meta.glob(
  [
    "../content/coding/published/*.md",
    "../content/daily/published/*.md",
  ],
  {
    eager: true,
    import: "default",
    query: "?raw",
  },
) as Record<string, string>;

const mediaFiles = import.meta.glob("../content/media/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

function resolveObsidianImages(content: string) {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (original, fileName: string) => {
    const mediaPath = Object.keys(mediaFiles).find(
      (path) => path.split("/").pop() === fileName,
    );

    if (!mediaPath) {
      return original;
    }

    return `![${fileName}](${mediaFiles[mediaPath]})`;
  });
}

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---\n")) {
    return { data: {} as Record<string, string>, content: raw };
  }

  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) {
    return { data: {} as Record<string, string>, content: raw };
  }

  const data = Object.fromEntries(
    raw
      .slice(4, end)
      .split("\n")
      .map((line) => {
        const separator = line.indexOf(":");
        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^["']|["']$/g, "");
        return [key, value];
      })
      .filter(([key]) => key),
  );

  return {
    data,
    content: resolveObsidianImages(raw.slice(end + 5).trimStart()),
  };
}

function parseTags(raw: string) {
  const frontmatter = raw.match(/^---\n([\s\S]*?)\n---\n?/)?.[1] ?? "";
  const tagsBlock =
    frontmatter.match(/^tags:\s*\n((?:\s+-\s+.*\n?)*)/m)?.[1] ?? "";

  if (tagsBlock) {
    return [...tagsBlock.matchAll(/^\s+-\s+(.+)$/gm)].map((match) =>
      match[1].trim().replace(/^["']|["']$/g, "").replace(/^#/, ""),
    );
  }

  const inlineTags = frontmatter.match(/^tags:\s*(.+)$/m)?.[1] ?? "";

  return inlineTags
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((tag) =>
      tag.trim().replace(/^["']|["']$/g, "").replace(/^#/, ""),
    )
    .filter(Boolean);
}

function parsePost(path: string, raw: string): Post {
  const { data, content } = parseFrontmatter(raw);
  const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";

  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? "NOTE"),
    tags: parseTags(raw),
    kind: data.kind === "daily" ? "daily" : "coding",
    readTime: String(data.readTime ?? "3분"),
    content,
  };
}

export function getAllPosts(kind?: PostKind) {
  return Object.entries(markdownFiles)
    .map(([path, raw]) => parsePost(path, raw))
    .filter((post) => !kind || post.kind === kind)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug),
    );
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function formatPostDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date || "날짜 미정";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}
