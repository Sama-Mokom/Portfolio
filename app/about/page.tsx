import Image from "next/image";
import Link from "@/components/link";
import { experience } from "@/content/profile";
import { journey, skillGroups } from "@/content/profile-secondary";
import { pageMetadata } from "@/lib/metadata";
import { SectionIndex } from "./section-index";
import "../secondary.css";

export const metadata = pageMetadata(
  "About",
  "The person behind the work: my journey from repairing computers to building software, studying computer engineering, and learning deliberately.",
  "/about",
);

export default function AboutPage() {
  return (
    <div className="container secondary-page about-page">
      <section
        className="about-opening"
        id="intro"
        aria-labelledby="about-title"
      >
        <div className="about-opening-copy">
          <p className="eyebrow">About me</p>
          <h1 id="about-title">
            More than
            <br />
            just code.
          </h1>
          <p className="lead">
            I’m Mokom, a final-year Computer Engineering student at the
            University of Buea. I build software for problems I can see around
            me, and I care about understanding how it works.
          </p>
          <div className="secondary-actions">
            <Link className="button button-secondary" href="/resume">
              View résumé <span aria-hidden="true">↓</span>
            </Link>
            <Link className="button" href="/contact">
              Get in touch <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <figure className="about-portrait-wrap">
          <Image
            className="about-portrait"
            src="/media/mokom-portrait.webp"
            width={720}
            height={900}
            sizes="(max-width: 767px) 100vw, 45vw"
            alt="Nkeng Sama Mokom"
            priority
          />
          <figcaption>Buea, Cameroon. Curious by habit.</figcaption>
        </figure>
      </section>
      <SectionIndex />
      <section
        className="secondary-section narrative-section"
        aria-labelledby="start-title"
      >
        <p className="eyebrow">Before the software</p>
        <div className="prose">
          <h2 id="start-title">
            It started with a computer
            <br className="desktop-break" /> that kept breaking.
          </h2>
          <p>
            Our first desktop struggled to run GTA: Vice City. When it broke, I
            wanted to know why. Opening it up became a habit, and eventually
            that habit extended to repairing phones and laptops for family and
            friends.
          </p>
          <p>
            After my Advanced Levels, I was considering Electrical Engineering.
            Watching ThePrimeAgen talk about software—with equal parts technical
            depth and humour—pulled me toward Computer Engineering instead.
          </p>
          <p>
            That curiosity still shapes the way I work. I like to draw the
            system, understand its rules, then build it. The interface matters,
            but so do the details underneath: who can change a record, what
            happens when two requests arrive together, and whether the system
            still helps when the connection is poor.
          </p>
        </div>
      </section>
      <section
        className="secondary-section"
        id="journey"
        aria-labelledby="journey-title"
      >
        <div className="secondary-section-heading">
          <p className="eyebrow">01 / My journey</p>
          <h2 id="journey-title">From curiosity to intention.</h2>
        </div>
        <ol className="journey-list">
          {journey.map((stage) => (
            <li key={stage.period}>
              <div className="journey-time">
                <span className="eyebrow">{stage.time}</span>
                <span>{stage.period}</span>
              </div>
              <div className="journey-copy">
                <h3>{stage.title}</h3>
                <p>{stage.summary}</p>
                <details>
                  <summary>More about this chapter</summary>
                  <p>{stage.detail}</p>
                </details>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="secondary-section"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="secondary-section-heading">
          <p className="eyebrow">02 / Experience</p>
          <h2 id="experience-title">Learning in real codebases.</h2>
        </div>
        <div className="experience-list">
          {experience.map((entry) => (
            <article key={entry.role + entry.company}>
              <div className="experience-meta">
                <p className="eyebrow">{entry.period}</p>
                <p>{entry.location}</p>
              </div>
              <div>
                <h3>{entry.company}</h3>
                <p className="entry-role">{entry.role}</p>
                <p>{entry.description}</p>
                <ul>
                  {entry.contributions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="secondary-section secondary-columns"
        id="education"
        aria-labelledby="education-title"
      >
        <div>
          <p className="eyebrow">03 / Education</p>
          <h2 id="education-title">An engineering foundation.</h2>
        </div>
        <div className="prose">
          <h3>B.Eng. Computer Engineering</h3>
          <p>
            University of Buea · Faculty of Engineering and Technology
            <br />
            Level 400 · Expected graduation in 2027
          </p>
          <p>
            My coursework connects software with the systems underneath it:
            advanced databases, cloud computing, software verification,
            human–computer interaction and computer networks.
          </p>
          <p>
            Substantial work includes a PostgreSQL chat schema with audit
            triggers and application roles, a full verification cycle on a
            deliberately defective C++ banking application, and cloud
            deployments across IaaS, PaaS and SaaS.
          </p>
        </div>
      </section>
      <section
        className="secondary-section"
        id="skills"
        aria-labelledby="skills-title"
      >
        <div className="secondary-section-heading">
          <p className="eyebrow">04 / Skills</p>
          <h2 id="skills-title">Tools, with context.</h2>
          <p>What I’ve used, and where I’ve used it.</p>
        </div>
        <div className="skill-list">
          {skillGroups.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              <p className="skill-tools">{group.tools}</p>
              <p>{group.context}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="secondary-section secondary-columns"
        id="beyond"
        aria-labelledby="beyond-title"
      >
        <div>
          <p className="eyebrow">05 / Beyond the editor</p>
          <h2 id="beyond-title">A few other constants.</h2>
        </div>
        <div className="prose">
          <p>
            I’m a Manchester United supporter, including the difficult seasons.
            Give me a science-fiction thriller with something to argue about
            afterwards, or Attack on Titan, and I’m happy.
          </p>
          <p>
            My music can move from Sinatra and Louis Armstrong to Afrobeats and
            hip-hop, with classical, alternative rock, gospel and worship in
            between. There isn’t much of a unifying genre.
          </p>
          <p>
            Access to education matters to me. I volunteer with the Grow You
            Grow Me Foundation, a Bamenda-based nonprofit providing free
            education to young Cameroonians, and made its launch pamphlet in
            April 2026.
          </p>
          <p>
            I also make time for the local technology community. CIMFEST 2025
            was my first hackathon, hosted in partnership with NervTek; our team
            placed 11th out of 21. I’ve attended AWS Community Day Cameroon in
            two consecutive years.
          </p>
        </div>
      </section>
      <section
        className="secondary-section secondary-columns"
        id="values"
        aria-labelledby="values-title"
      >
        <div>
          <p className="eyebrow">06 / What matters</p>
          <h2 id="values-title">Understanding comes first.</h2>
        </div>
        <div className="prose">
          <p>
            I want to be able to explain the systems I build. On CampusDesk,
            that means writing the backend myself and treating documentation,
            diagrams and review as part of the work.
          </p>
          <p>
            I believe local problems deserve careful engineering. A university
            document queue or an unreliable connection can be easy to overlook,
            but they have real consequences for the person using the system.
          </p>
          <p>
            I try to let evidence change my mind. A passing test, an
            unsuccessful design and a backtest that undermines my own hypothesis
            all tell me something useful. Sharing what I learn—and helping
            others get access to learning—is part of the same commitment.
          </p>
          <Link className="text-link" href="/work">
            See how that shows up in my work <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section
        className="secondary-section secondary-columns"
        id="accessibility"
        aria-labelledby="accessibility-title"
      >
        <div>
          <p className="eyebrow">Using this site</p>
          <h2 id="accessibility-title">Accessibility</h2>
        </div>
        <div className="prose">
          <p>
            This site is designed toward WCAG 2.2 AA, with keyboard navigation,
            visible focus, readable contrast, reduced-motion support and content
            available without JavaScript.
          </p>
          <p>
            Automated checks cover every page in both themes. A full
            screen-reader and real-device review is still outstanding. If
            something gets in your way, <Link href="/contact">let me know</Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
