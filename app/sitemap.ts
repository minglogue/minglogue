import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/portfolio";

const siteUrl = "https://minglogue.popcornkim58.workers.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const postPages = getAllPosts().map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00+09:00`),
  }));
  const portfolioPages = getAllProjects().map((project) => ({
    url: `${siteUrl}/portfolio/${project.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/coding`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/daily`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/pudding`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/portfolio`,
      lastModified: new Date(),
    },
    ...postPages,
    ...portfolioPages,
  ];
}
