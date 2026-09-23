import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { articles } from "@/content/articles";
import { allTags } from "@/lib/content";
import { siteUrl, hasProductionUrl } from "@/lib/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!hasProductionUrl) return [];
  return [
    "",
    "/work",
    "/about",
    "/writing",
    "/lab",
    "/now",
    "/contact",
    "/resume",
    ...projects.map((p) => `/work/${p.slug}`),
    ...articles.map((a) => `/writing/${a.slug}`),
    ...allTags.map((t) => `/writing/tags/${t}`),
  ].map((path) => ({ url: `${siteUrl}${path}`, lastModified: "2026-09-21" }));
}
