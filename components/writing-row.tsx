import Link from "@/components/link";
import type { Article } from "@/content/articles";
import { articleReadingTime } from "@/lib/content";
export function WritingRow({ article }: { article: Article }) {
  return (
    <article className="writing-row">
      <time className="eyebrow" dateTime={article.date}>
        {new Date(article.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })}
      </time>
      <div>
        <h3>
          <Link href={`/writing/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.summary}</p>
      </div>
      <span className="reading-time">
        {articleReadingTime(article)} min read
      </span>
    </article>
  );
}
