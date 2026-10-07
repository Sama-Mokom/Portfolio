import Link from "@/components/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { getProject, getArticle } from "@/lib/content";
import { Arrow, Tags } from "@/components/ui";
import { ProjectMedia } from "@/components/project-media";
import { ProjectLinks } from "@/components/project-links";
import {
  ReadingProgress,
  TableOfContents,
  MobileContents,
} from "@/components/reading-tools";
import { pageMetadata, siteUrl } from "@/lib/metadata";
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  return p ? pageMetadata(p.title, p.tagline, `/work/${p.slug}`) : {};
}
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next =
    projects[
      (projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length
    ];
  const toc = project.sections.flatMap((s) =>
    s.id === "engineering-deep-dive"
      ? [
          { id: "decisions", title: "Key decisions" },
          { id: s.id, title: s.title },
        ]
      : [{ id: s.id, title: s.title }],
  );
  return (
    <div className="container">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary,
            url: `${siteUrl}/work/${project.slug}`,
            author: { "@type": "Person", name: "Nkeng Sama Mokom" },
          }),
        }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/work">
          <Arrow direction="left" /> Back to work
        </Link>
        <span aria-hidden="true">/</span>
        <span>{project.title}</span>
      </nav>
      <header className="study-hero">
        <div>
          <span className="eyebrow">Engineering case study</span>
          <h1>{project.title}</h1>
          <p className="lead">{project.tagline}</p>
          <Tags values={project.technologies} />
          <ProjectLinks project={project} className="study-project-links" />
        </div>
        <ProjectMedia
          project={project}
          className="study-project-media"
          sizes="(max-width: 900px) 100vw, 45vw"
          priority
        />
      </header>
      <dl className="study-metadata">
        <div>
          <dt>My role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Timeframe</dt>
          <dd>{project.timeframe}</dd>
        </div>
        <div>
          <dt>Current state</dt>
          <dd>{project.status}</dd>
        </div>
      </dl>
      <MobileContents sections={toc} />
      <div className="editorial-layout">
        <article className="prose">
          <p className="lead" style={{ marginBottom: "3rem" }}>
            {project.summary}
          </p>
          {project.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>
                <a className="heading-anchor" href={`#${section.id}`}>
                  {section.title}
                </a>
              </h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {section.id === "architecture" && (
                <figure className="diagram">
                  <ol>
                    {project.architecture.nodes.map((node) => (
                      <li key={node}>{node}</li>
                    ))}
                  </ol>
                  <figcaption>
                    Architecture illustration reconstructed from the project
                    notes. {project.architecture.description}
                  </figcaption>
                </figure>
              )}
              {section.id === "architecture" && (
                <div id="decisions" style={{ marginTop: "3rem" }}>
                  <h2>Key decisions</h2>
                  {project.decisions.map((decision) => (
                    <div className="decision" key={decision.title}>
                      <h3>{decision.title}</h3>
                      <p>
                        <strong>Choice.</strong> {decision.choice}
                      </p>
                      <p>
                        <strong>Alternative.</strong> {decision.rejected}
                      </p>
                      <p>
                        <strong>Trade-off.</strong> {decision.cost}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {section.id === "engineering-deep-dive" && (
                <details>
                  <summary>Inspect the engineering trade-offs</summary>
                  {project.decisions.map((d) => (
                    <p key={d.title}>
                      <strong>{d.title}.</strong> {d.cost}
                    </p>
                  ))}
                </details>
              )}
            </section>
          ))}
          {project.relatedWriting.length > 0 && (
            <section>
              <h2>Related writing</h2>
              {project.relatedWriting.map((slug) => {
                const article = getArticle(slug);
                return article ? (
                  <p key={slug}>
                    <Link href={`/writing/${slug}`}>{article.title}</Link>
                  </p>
                ) : null;
              })}
            </section>
          )}
        </article>
        <TableOfContents sections={toc} />
      </div>
      <nav className="related-links" aria-label="Case studies">
        <Link className="text-link" href="/work">
          <Arrow direction="left" /> All work
        </Link>
        <Link className="text-link" href={`/work/${next.slug}`}>
          Next: {next.title} <Arrow />
        </Link>
      </nav>
    </div>
  );
}
