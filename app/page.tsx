import Image from "next/image";
import Link from "@/components/link";
import { projects } from "@/content/projects";
import { articles } from "@/content/articles";
import { ProjectCard } from "@/components/project-card";
import { WritingRow } from "@/components/writing-row";
import { Arrow, SectionHeading } from "@/components/ui";
import { pageMetadata, siteUrl } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Computer engineer & full-stack developer",
  "I'm Nkeng Sama Mokom. I build thoughtful web and mobile systems for real-world conditions in Cameroon.",
  "/",
);
export default function Home() {
  const selected = ["campusdesk", "goldstrat", "netinsight"].map((slug) =>
    projects.find((p) => p.slug === slug)!,
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Nkeng Sama Mokom",
            url: siteUrl,
            jobTitle: "Computer engineering student and full-stack developer",
            sameAs: [
              "https://github.com/Sama-Mokom",
              "https://www.linkedin.com/in/sama-mokom-784161283",
            ],
            affiliation: {
              "@type": "CollegeOrUniversity",
              name: "University of Buea",
            },
          }),
        }}
      />
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">Engineering for the world around me</p>
          <h1>
            <span className="hero-title-line">
              <span className="hero-title-prefix">I’m </span>
              Nkeng Sama
            </span>{" "}
            <span className="hero-title-line hero-title-accent">Mokom.</span>
          </h1>
          <p className="discipline">
            <span>Computer engineer.</span> <span>Full-stack developer.</span>{" "}
            <span className="discipline-break">A deliberate learner.</span>
          </p>
          <p className="lead">
            I build web and mobile systems for real problems in Cameroon — from
            making university document requests traceable to measuring the
            networks we rely on.
          </p>
          <div className="actions">
            <Link href="/work" className="button">
              View my work <Arrow />
            </Link>
            <Link href="/resume" className="button button-secondary">
              Read my résumé <Arrow direction="down" />
            </Link>
          </div>
          <div className="hero-facts">
            <div>
              <strong>Buea, Cameroon</strong>WAT / UTC+1
            </div>
            <div>
              <strong>Computer Engineering</strong>University of Buea · 2027
            </div>
            <div>
              <strong>Open to opportunities</strong>Software & integration work
            </div>
          </div>
        </div>
        <figure className="hero-portrait">
          <Image
            src="/media/mokom-portrait.webp"
            alt="Portrait of Nkeng Sama Mokom"
            width={1200}
            height={1444}
            quality={80}
            sizes="(max-width: 599px) 100vw, (max-width: 640px) 25vw, (max-width: 900px) 90vw, 45vw"
            priority
          />
          <figcaption className="portrait-caption">
            <span>Build. Understand. Improve.</span>
            <span>Nkeng Sama Mokom</span>
          </figcaption>
        </figure>
      </section>
      <div className="status-strip">
        <div className="container">
          <span className="eyebrow">Currently at work</span>
          <p>
            CampusDesk deployment planning · GoHighLevel integrations at
            V-Groups
          </p>
          <Link href="/now" style={{ color: "inherit", whiteSpace: "nowrap" }}>
            Now <Arrow />
          </Link>
        </div>
      </div>
      <section className="section container">
        <SectionHeading
          eyebrow="01 / Selected work"
          title="Real problems. Considered solutions."
        >
          <Link className="text-link" href="/work">
            View all work <Arrow />
          </Link>
        </SectionHeading>
        <div className="project-grid">
          {selected.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>
      <section className="section container">
        <SectionHeading eyebrow="02 / Writing" title="Notes from the work.">
          <Link className="text-link" href="/writing">
            All writing <Arrow />
          </Link>
        </SectionHeading>
        {articles.slice(0, 2).map((article) => (
          <WritingRow article={article} key={article.slug} />
        ))}
      </section>
      <section className="section container current-pull">
        <div>
          <span className="eyebrow">03 / Currently</span>
          <Link className="text-link" href="/now">
            The longer version <Arrow />
          </Link>
        </div>
        <p className="lead">
          Learning what it takes to move a tested application into production —
          and giving the infrastructure as much care as the code.
        </p>
      </section>
      <section className="section container contact-invitation">
        <div>
          <span className="eyebrow">Have something in mind?</span>
          <h2>Let’s build something that matters.</h2>
        </div>
        <Link href="/contact" className="button">
          Get in touch <Arrow />
        </Link>
      </section>
    </>
  );
}
