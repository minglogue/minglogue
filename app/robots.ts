import type { MetadataRoute } from "next";

const siteUrl = "https://popcorn-kim-log.popcornkim58.workers.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
