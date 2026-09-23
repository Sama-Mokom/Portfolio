import type { Metadata } from "next";
const raw = process.env.SITE_URL?.trim();
function productionOrigin(value: string | undefined): string | null {
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("SITE_URL must be a valid HTTPS origin without a path.");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("SITE_URL must be a valid HTTPS origin without a path.");
  }
  return url.origin;
}
const origin = productionOrigin(raw);
export const hasProductionUrl = origin !== null;
export const siteUrl = origin ?? "http://localhost:3000";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    ...(hasProductionUrl
      ? { alternates: { canonical: `${siteUrl}${path}` } }
      : {}),
    openGraph: {
      title: `${title} · Mokom`,
      description,
      ...(hasProductionUrl ? { url: `${siteUrl}${path}` } : {}),
      type: "website",
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Mokom — Computer engineer, building for real-world conditions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/opengraph-image`],
    },
    robots: hasProductionUrl
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}
