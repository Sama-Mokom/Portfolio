import Link from "@/components/link";
import { projects } from "@/content/projects";
import { otherWork } from "@/content/profile";
import { PageIntro, Arrow, SectionHeading } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
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
      <div className="project-grid project-grid--work">
        {projects.map((p, i) => (
          <ProjectCard
            project={p}
            priority={i === 0}
            headingLevel="h2"
            key={p.slug}
          />
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
