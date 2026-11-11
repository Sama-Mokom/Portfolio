import Script from "next/script";

const UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";
const UMAMI_DOMAIN = "samamokom.vercel.app";

export function Analytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  if (process.env.VERCEL_ENV !== "production" || !websiteId) {
    return null;
  }

  return (
    <Script
      src={UMAMI_SCRIPT_URL}
      strategy="afterInteractive"
      data-website-id={websiteId}
      data-domains={UMAMI_DOMAIN}
      data-exclude-search="true"
    />
  );
}
