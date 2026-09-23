import type { MetadataRoute } from "next";
import { siteUrl, hasProductionUrl } from "@/lib/metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(hasProductionUrl
        ? { allow: "/", disallow: "/api/" }
        : { disallow: "/" }),
    },
    ...(hasProductionUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
