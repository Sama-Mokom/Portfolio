import Link from "@/components/link";
import { articles } from "@/content/articles";
import { allTags, articleReadingTime } from "@/lib/content";
import { PageIntro, Arrow } from "@/components/ui";
import { WritingRow } from "@/components/writing-row";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Writing",
  "Notes on engineering decisions, debugging and technical trade-offs, drawn from my own projects.",
  "/writing",
);
export default function Writing() {
  const latest = articles[0];
  return (
    <div className="container">
      <PageIntro
        eyebrow="All posts"
        title="Engineering notes and ideas."
        description="Notes on the decisions behind the code. What worked, what failed, and what changed my understanding."
      />
      <div className="tags" aria-label="Browse by topic">
        {allTags.map((tag) => (
          <Link className="tag" href={`/writing/tags/${tag}`} key={tag}>
            {tag}
          </Link>
        ))}
      </div>
      <article className="featured-article">
        <span className="eyebrow">
          Latest note ·{" "}
          <time dateTime={latest.date}>
            {new Date(latest.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>
        </span>
        <h2>
          <Link href={`/writing/${latest.slug}`}>{latest.title}</Link>
        </h2>
        <p>{latest.summary}</p>
        <Link className="text-link" href={`/writing/${latest.slug}`}>
          Read the note · {articleReadingTime(latest)} min <Arrow />
        </Link>
      </article>
      {articles.slice(1).map((article) => (
        <WritingRow article={article} key={article.slug} />
      ))}
      <section className="section">
        <p className="muted">
          Occasional writing, when there’s something worth sharing.
        </p>
        <Link className="text-link" href="/rss.xml" prefetch={false}>
          Subscribe via RSS <Arrow />
        </Link>
      </section>
    </div>
  );
}
