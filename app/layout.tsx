import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  hasProductionUrl,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/metadata";
const newsreader = localFont({
  src: "../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",
  variable: "--font-serif",
  display: "optional",
  weight: "200 800",
  adjustFontFallback: "Times New Roman",
});
const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  display: "optional",
  weight: "100 900",
  adjustFontFallback: "Arial",
});
const mono = localFont({
  src: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
  variable: "--font-mono",
  display: "optional",
  weight: "400",
  preload: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Software Engineer in Cameroon`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: hasProductionUrl ? siteUrl : undefined }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  referrer: "origin-when-cross-origin",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(e){try{if(!localStorage.getItem('theme')){document.documentElement.dataset.theme=e.matches?'dark':'light';dispatchEvent(new Event('themechange'));}}catch(_){}});}catch(_){}})()`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
