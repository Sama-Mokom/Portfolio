import { articles } from "@/content/articles";
import { siteUrl } from "@/lib/metadata";
export const dynamic = "force-static";
function xml(s: string) {
  return s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
}
export function GET() {
  const items = articles
    .map(
      (a) =>
        `<item><title>${xml(a.title)}</title><link>${siteUrl}/writing/${a.slug}</link><guid>${siteUrl}/writing/${a.slug}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${xml(a.summary)}</description><content:encoded>${xml(a.sections.map((s) => `<h2>${xml(s.title)}</h2>${s.paragraphs.map((p) => `<p>${xml(p)}</p>`).join("")}`).join("") + (a.code ? `<pre><code>${xml(a.code.value)}</code></pre>` : ""))}</content:encoded></item>`,
    )
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>Mokom — Writing</title><link>${siteUrl}/writing</link><description>Engineering notes from Nkeng Sama Mokom.</description><language>en</language>${items}</channel></rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
