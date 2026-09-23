import { existsSync, statSync } from "node:fs";
import path from "node:path";
import Link from "@/components/link";
import { PrintButton } from "@/components/print-button";
import { experience } from "@/content/profile";
import { skillGroups } from "@/content/profile-secondary";
import { CONTACT_EMAIL } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import "../secondary.css";

export const metadata = pageMetadata(
  "Résumé",
  "Nkeng Sama Mokom — software engineer and final-year Computer Engineering student. Experience, education, selected projects and technical skills.",
  "/resume",
);

export default function ResumePage() {
  const pdfPath = path.join(process.cwd(), "public", "mokom-resume.pdf");
  const pdfSize = existsSync(pdfPath)
    ? Math.ceil(statSync(pdfPath).size / 1024)
    : null;
  return (
    <div className="container secondary-page resume-page">
      <div className="resume-controls">
        <p className="eyebrow">Résumé / September 2026</p>
        <div className="secondary-actions">
          {pdfSize && (
            <a className="button" href="/mokom-resume.pdf" download>
              Download PDF <span className="download-size">{pdfSize} KB</span>
              <span aria-hidden="true">↓</span>
            </a>
          )}
          <PrintButton />
        </div>
      </div>
      <header className="resume-header">
        <h1>Nkeng Sama Mokom</h1>
        <p className="lead">
          Software engineer · B.Eng. Computer Engineering student
        </p>
        <p>Buea, Cameroon · WAT / UTC+1</p>
        <div className="resume-contact">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <a href="https://github.com/Sama-Mokom">github.com/Sama-Mokom</a>
          <a href="https://www.linkedin.com/in/sama-mokom-784161283">
            LinkedIn
          </a>
        </div>
      </header>
      <section className="resume-section" aria-labelledby="resume-summary">
        <h2 id="resume-summary">Profile</h2>
        <p>
          Final-year Computer Engineering student building full-stack software
          with Laravel, React, Vue and TypeScript. Experience contributing to a
          production education platform through reviewed pull requests.
          Interested in data correctness, understandable interfaces and systems
          designed for local infrastructure constraints. Currently developing
          cloud and delivery skills through CampusDesk.
        </p>
      </section>
      <section className="resume-section" aria-labelledby="resume-experience">
        <h2 id="resume-experience">Experience</h2>
        {experience.map((entry) => (
          <article className="resume-entry" key={entry.company + entry.role}>
            <div className="resume-entry-heading">
              <h3>{entry.company}</h3>
              <p>{entry.period}</p>
            </div>
            <p className="entry-role">
              {entry.role} · {entry.location}
            </p>
            <p>{entry.description}</p>
            <ul>
              {entry.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className="resume-section" aria-labelledby="resume-education">
        <h2 id="resume-education">Education</h2>
        <article className="resume-entry">
          <div className="resume-entry-heading">
            <h3>University of Buea</h3>
            <p>Expected graduation: 2027</p>
          </div>
          <p>
            B.Eng. Computer Engineering · Level 400
            <br />
            Faculty of Engineering and Technology
          </p>
          <p>
            Relevant work: advanced databases, cloud computing, software
            verification and validation, human–computer interaction, computer
            networks and mobile application development.
          </p>
        </article>
      </section>
      <section className="resume-section" aria-labelledby="resume-projects">
        <h2 id="resume-projects">Selected projects</h2>
        <article className="resume-entry">
          <h3>
            <Link href="/work/campusdesk">CampusDesk</Link>
          </h3>
          <p className="entry-role">
            Sole engineer · Laravel, Vue 3, TypeScript, MySQL · Active
          </p>
          <ul>
            <li>
              Built a university document request and tracking system with four
              role-specific dashboards, now wired and tested.
            </li>
            <li>
              Resolved a concurrent stage-claiming problem with transactional
              checks and row locking; modelled auditable request transitions.
            </li>
            <li>
              Currently planning CI/CD and deployment with Docker and AWS.
            </li>
          </ul>
        </article>
        <article className="resume-entry">
          <h3>
            <Link href="/work/netinsight">NetInsight</Link>
          </h3>
          <p className="entry-role">
            Team coursework · React Native, Node.js, MongoDB · Delivered
          </p>
          <p>
            Worked on a mobile network-quality project shaped around Cameroon’s
            connectivity constraints, with requirements, modelling and an
            offline synchronisation architecture.
          </p>
        </article>
        <article className="resume-entry">
          <h3>
            <Link href="/work/goldstrat">GoldStrat / SMC_EA</Link>
          </h3>
          <p className="entry-role">
            Quantitative systems experiments · MQL5 · Active
          </p>
          <p>
            Investigated position-sizing correctness, order constraints and
            regime dependence through systematic backtesting. This is software
            validation work, with no live trading record.
          </p>
        </article>
        <article className="resume-entry">
          <h3>Cameroon Music Industry Platform</h3>
          <p className="entry-role">
            CIMFEST Hackathon 2025 MVP · Halted after Milestone 2
          </p>
          <p>
            Contributed to a team MVP for my first hackathon, hosted by CIMFEST
            in partnership with NervTek. Our team placed 11th out of 21. Used
            Next.js with exploratory NestJS experience.
          </p>
        </article>
      </section>
      <section className="resume-section" aria-labelledby="resume-skills">
        <h2 id="resume-skills">Technical skills</h2>
        <dl className="resume-skills">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <dt>{group.title}</dt>
              <dd>
                {group.tools}
                <br />
                <span>{group.context}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="resume-section" aria-labelledby="resume-community">
        <h2 id="resume-community">Community</h2>
        <p>
          Volunteer with the Grow You Grow Me Foundation, supporting access to
          education in Cameroon; produced its April 2026 launch pamphlet.
          Attended AWS Community Day Cameroon in two consecutive years.
        </p>
      </section>
      <p className="resume-updated">
        Updated 18 September 2026. <Link href="/contact">Get in touch</Link>.
      </p>
    </div>
  );
}
