export type PuddingPost = {
  slug: string;
  date: string;
  tags: string[];
  image: string | null;
  content: string;
  published: boolean;
};

const puddingMarkdownFiles = import.meta.glob("../content/pudding/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const puddingImageFiles = import.meta.glob(
  [
    "../content/pudding/**/*.{avif,gif,jpeg,jpg,png,webp}",
    "../content/media/*.{avif,gif,jpeg,jpg,png,webp}",
  ],
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

function parsePuddingFile(path: string, raw: string): PuddingPost {
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = frontmatterMatch?.[1] ?? "";
  const content = raw.slice(frontmatterMatch?.[0].length ?? 0).trim();
  const scalar = (key: string) =>
    frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]
      ?.trim()
      .replace(/^["']|["']$/g, "") ?? "";
  const tagsBlock = frontmatter.match(/^tags:\s*\n((?:\s+-\s+.*\n?)*)/m)?.[1] ?? "";
  const tags = tagsBlock
    ? [...tagsBlock.matchAll(/^\s+-\s+(.+)$/gm)].map((match) => match[1].trim())
    : scalar("tags")
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  const bodyImage =
    content.match(/!\[\[([^\]|]+\.(?:avif|gif|jpe?g|png|webp))(?:\|[^\]]+)?\]\]/i)?.[1] ??
    content.match(/!\[[^\]]*\]\(([^)]+\.(?:avif|gif|jpe?g|png|webp))\)/i)?.[1] ??
    "";
  const imageName = (scalar("image") || bodyImage).replace(/^\.\//, "");
  const imagePath = Object.keys(puddingImageFiles).find(
    (assetPath) => assetPath.split("/").pop() === imageName,
  );

  return {
    slug: path.split("/").pop()?.replace(/\.md$/, "") ?? "",
    date: scalar("date"),
    tags,
    image: imagePath ? puddingImageFiles[imagePath] : null,
    content: content
      .replace(/!\[\[[^\]]+\]\]/g, "")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .trim(),
    published: scalar("published") !== "false",
  };
}

export function getPuddingPosts() {
  return Object.entries(puddingMarkdownFiles)
    .map(([path, raw]) => parsePuddingFile(path, raw))
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}
