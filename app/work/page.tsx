import Link from "@/components/link";
import { projects } from "@/content/projects";
import { otherWork } from "@/content/profile";
import { PageIntro, Arrow, Tags, SectionHeading } from "@/components/ui";
import { ProjectArt } from "@/components/project-art";
import { ProjectLinks } from "@/components/project-links";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Work",
  "Five engineering case studies: decisions, difficult bugs, and what the evidence actually says.",
  "/work",
);
export default function Work() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="Featured work"
        title="Projects that create real impact."
        description="University systems, mobile network measurement, production contributions and experiments that challenged my assumptions. Here is what I built — and what I learned."
      />
      <div className="work-list">
        {projects.map((p, i) => (
          <article className="work-band" key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              aria-label={`Explore the ${p.title} architecture`}
            >
              <ProjectArt slug={p.slug} />
            </Link>
            <div>
              <span className="eyebrow">
                0{i + 1} / {p.status}
              </span>
              <h2>{p.title}</h2>
              <p>{p.tagline}</p>
              <Tags values={p.technologies} />
              <p className="work-meta">
                {p.role} · {p.timeframe}
              </p>
              <Link href={`/work/${p.slug}`} className="text-link">
                Read the {p.title} study <Arrow />
              </Link>
              <ProjectLinks project={p} />
            </div>
          </article>
        ))}
      </div>
      <section className="section">
        <SectionHeading eyebrow="Beyond the case studies" title="Other work" />
        <dl className="other-work">
          {otherWork.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>
                {item.description}
                <div className="tags">
                  {item.technologies.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {item.repository && (
                    <a href={item.repository} target="_blank" rel="noreferrer">
                      View code <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {item.href &&
                    (item.href.startsWith("http") ? (
                      <a href={item.href} target="_blank" rel="noreferrer">
                        Visit live site <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <Link href={item.href}>
                        Explore the work <Arrow />
                      </Link>
                    ))}
                </div>
              </dd>
            </div>
          ))}
        </dl>
        <Link className="text-link" href="/lab">
          Explore smaller experiments in the lab <Arrow />
        </Link>
      </section>
    </div>
  );
}
