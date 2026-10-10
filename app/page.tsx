import Image from "next/image";
import Link from "@/components/link";
import { projects } from "@/content/projects";
import { articles } from "@/content/articles";
import { ProjectCard } from "@/components/project-card";
import { WritingRow } from "@/components/writing-row";
import { Arrow, SectionHeading } from "@/components/ui";
import {
  pageMetadata,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/metadata";
import { profile } from "@/content/profile";
export const metadata = pageMetadata(
  "Nkeng Sama Mokom | Software Engineer in Cameroon",
  siteDescription,
  "/",
  { absoluteTitle: true },
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
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                url: siteUrl,
                name: siteName,
                description: siteDescription,
                inLanguage: "en",
                publisher: { "@id": `${siteUrl}/#person` },
              },
              {
                "@type": "ProfilePage",
                "@id": `${siteUrl}/#profile-page`,
                url: siteUrl,
                name: `${siteName} — Software Engineer in Cameroon`,
                description: siteDescription,
                dateModified: profile.lastUpdated,
                isPartOf: { "@id": `${siteUrl}/#website` },
                mainEntity: { "@id": `${siteUrl}/#person` },
              },
              {
                "@type": "Person",
                "@id": `${siteUrl}/#person`,
                name: siteName,
                alternateName: ["Sama Mokom", "Mokom"],
                url: siteUrl,
                image: `${siteUrl}/media/mokom-portrait.webp`,
                description: siteDescription,
                jobTitle: "Software engineer and full-stack developer",
                sameAs: [profile.github, profile.linkedin],
                homeLocation: {
                  "@type": "Place",
                  name: "Buea, Cameroon",
                },
                affiliation: {
                  "@type": "CollegeOrUniversity",
                  name: "University of Buea",
                },
                knowsAbout: [
                  "Software engineering",
                  "Full-stack web development",
                  "Backend development",
                  "Cloud computing",
                  "DevOps",
                  "Mobile application development",
                  "Database design",
                  "API design",
                ],
              },
            ],
          }).replace(/</g, "\\u003c"),
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
          <p className="discipline">Software Engineer</p>
          <p className="lead">
            I build full-stack web and mobile systems for real problems in
            Cameroon — from making university document requests traceable to
            measuring the networks we rely on.
          </p>
          <div className="actions">
            <Link href="/contact" className="button">
              Work with me <Arrow />
            </Link>
            <Link href="/work" className="button button-secondary">
              View my work <Arrow />
            </Link>
            <Link href="/resume" className="button button-secondary">
              Read my résumé <Arrow direction="down" />
            </Link>
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
          Learning what it takes to move a tested application into production
          with Docker and AWS — and giving cloud infrastructure and DevOps as
          much care as the code.
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
