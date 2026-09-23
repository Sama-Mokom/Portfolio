import Link from "@/components/link";
import { notFound } from "next/navigation";
import { allTags, getArticlesByTag } from "@/lib/content";
import { WritingRow } from "@/components/writing-row";
import { PageIntro, Arrow } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const dynamicParams = false;
export function generateStaticParams() {
  return allTags.map((tag) => ({ tag }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return pageMetadata(
    `${tag} notes`,
    `Engineering notes about ${tag}.`,
    `/writing/tags/${tag}`,
  );
}
export default async function TagArchive({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  if (!allTags.includes(tag)) notFound();
  return (
    <div className="container">
      <PageIntro eyebrow="Writing / Topic" title={`Notes on ${tag}.`} />
      {getArticlesByTag(tag).map((article) => (
        <WritingRow article={article} key={article.slug} />
      ))}
      <Link className="text-link" href="/writing">
        <Arrow direction="left" /> All writing
      </Link>
    </div>
  );
}
