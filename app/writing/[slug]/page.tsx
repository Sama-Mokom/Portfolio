import Link from "@/components/link";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { getArticle, getProject, articleReadingTime } from "@/lib/content";
import { Arrow } from "@/components/ui";
import { CodeBlock } from "@/components/code-block";
import {
  ReadingProgress,
  TableOfContents,
  MobileContents,
} from "@/components/reading-tools";
import { pageMetadata, siteUrl } from "@/lib/metadata";
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = getArticle((await params).slug);
  return article
    ? pageMetadata(article.title, article.summary, `/writing/${article.slug}`)
    : {};
}
export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const index = articles.findIndex((a) => a.slug === article.slug);
  return (
    <div className="container">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.summary,
            datePublished: article.date,
            author: {
              "@type": "Person",
              name: "Nkeng Sama Mokom",
              url: `${siteUrl}/about`,
            },
            url: `${siteUrl}/writing/${article.slug}`,
          }),
        }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/writing">
          <Arrow direction="left" /> Writing
        </Link>
      </nav>
      <header className="article-header">
        <span className="eyebrow">
          <time dateTime={article.date}>21 September 2026</time> ·{" "}
          {articleReadingTime(article)} min read
        </span>
        <h1>{article.title}</h1>
        <p className="lead">{article.summary}</p>
        <div className="tags">
          {article.tags.map((tag) => (
            <Link className="tag" href={`/writing/tags/${tag}`} key={tag}>
              {tag}
            </Link>
          ))}
        </div>
      </header>
      <MobileContents sections={article.sections} />
      <div className="editorial-layout">
        <article className="prose">
          {article.sections.map((section, i) => (
            <section id={section.id} key={section.id}>
              <h2>
                <a className="heading-anchor" href={`#${section.id}`}>
                  {section.title}
                </a>
              </h2>
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {i === 1 && article.code && (
                <CodeBlock
                  code={article.code.value}
                  label={article.code.label}
                  language={article.code.language}
                />
              )}
              {i === 2 && (
                <figure className="diagram">
                  <ol>
                    {(article.relatedWork.includes("campusdesk")
                      ? [
                          "Check eligibility",
                          "Claim within a transaction",
                          "Preserve ownership history",
                        ]
                      : [
                          "Verify the calculation",
                          "Inspect results by period",
                          "Reconsider the claim",
                        ]
                    ).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <figcaption>
                    An explanatory view of the reasoning described in this note.
                  </figcaption>
                </figure>
              )}
            </section>
          ))}
          <aside className="author-note">
            <h2>Written from the work.</h2>
            <p>
              I’m Mokom, a computer engineering student in Buea. These notes
              draw on my project record and the questions it left me with.
            </p>
            <Link className="text-link" href="/about">
              More about me <Arrow />
            </Link>
          </aside>
          {article.relatedWork.map((slug) => {
            const p = getProject(slug);
            return p ? (
              <p key={slug}>
                <Link href={`/work/${slug}`}>
                  Read the {p.title} case study
                </Link>
              </p>
            ) : null;
          })}
        </article>
        <TableOfContents sections={article.sections} />
      </div>
      <nav className="related-links" aria-label="More writing">
        <Link className="text-link" href="/writing">
          <Arrow direction="left" /> All writing
        </Link>
        {articles.length > 1 && (
          <Link
            className="text-link"
            href={`/writing/${articles[(index + 1) % articles.length].slug}`}
          >
            {articles[(index + 1) % articles.length].title} <Arrow />
          </Link>
        )}
      </nav>
    </div>
  );
}
