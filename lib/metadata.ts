import type { Metadata } from "next";

export const siteName = "Nkeng Sama Mokom";
export const siteDescription =
  "Portfolio of Nkeng Sama Mokom, a software engineer and full-stack developer in Cameroon. Explore web and mobile projects, backend engineering, cloud deployment, DevOps learning and technical writing.";

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
  options: { absoluteTitle?: boolean } = {},
): Metadata {
  const socialTitle = options.absoluteTitle ? title : `${title} | ${siteName}`;

  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      ...(hasProductionUrl ? { canonical: `${siteUrl}${path}` } : {}),
      types: {
        "application/rss+xml": hasProductionUrl
          ? `${siteUrl}/rss.xml`
          : "/rss.xml",
      },
    },
    openGraph: {
      title: socialTitle,
      description,
      ...(hasProductionUrl ? { url: `${siteUrl}${path}` } : {}),
      type: "website",
      siteName,
      locale: "en_CM",
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${siteName} — software engineer in Cameroon`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [`${siteUrl}/opengraph-image`],
    },
    robots: hasProductionUrl
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
  };
}
