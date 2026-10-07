import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { articles } from "@/content/articles";
import { profile } from "@/content/profile";
import { allTags } from "@/lib/content";
import { siteUrl, hasProductionUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!hasProductionUrl) return [];

  const corePages = [
    { path: "", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/work", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/writing", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/lab", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/now", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/resume", changeFrequency: "monthly" as const, priority: 0.8 },
  ].map(({ path, ...entry }) => ({
    url: `${siteUrl}${path}`,
    lastModified: profile.lastUpdated,
    ...entry,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: profile.lastUpdated,
    changeFrequency: project.status.toLowerCase().includes("active")
      ? "monthly"
      : "yearly",
    priority: project.featured ? 0.8 : 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/writing/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const latestArticleDate = articles
    .map((article) => article.date)
    .sort()
    .at(-1);
  const tagPages: MetadataRoute.Sitemap = allTags.map((tag) => ({
    url: `${siteUrl}/writing/tags/${tag}`,
    lastModified: latestArticleDate,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...corePages, ...projectPages, ...articlePages, ...tagPages];
}
