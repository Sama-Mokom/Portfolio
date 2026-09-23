import Link from "@/components/link";
import { PageIntro } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
import "../secondary.css";

export const metadata = pageMetadata(
  "Now",
  "What I am building, learning and thinking about in September 2026: CampusDesk, GoHighLevel integrations, Docker and AWS.",
  "/now",
);
const updated = "2026-09-18";
const stale =
  process.env.NODE_ENV === "development" &&
  Date.now() - Date.parse(updated) > 60 * 24 * 60 * 60 * 1000;

export default function NowPage() {
  return (
    <div className="container secondary-page now-page">
      <PageIntro
        eyebrow="Now"
        title="Currently building and learning."
        description="A small snapshot of where my attention is."
      />
      <p className="now-date eyebrow">
        Last updated <time dateTime={updated}>18 September 2026</time> ·
        Yaoundé, Cameroon
      </p>
      {stale && (
        <p className="now-stale" role="status">
          Development reminder: this Now page is more than 60 days old. Review
          the snapshot before publishing.
        </p>
      )}
      <div className="now-layout">
        <div className="now-timeline">
          <section aria-labelledby="now-building">
            <p className="eyebrow">01 / Building</p>
            <h2 id="now-building">Making the next step real.</h2>
            <p>
              <Link href="/work/campusdesk">CampusDesk</Link> is my main
              personal project. All four dashboards are wired and tested; I’m
              now planning CI/CD and deployment with Docker and AWS.
            </p>
            <p>
              Alongside it, my second V-Groups internship centres on custom
              GoHighLevel applications, workflows and integrations.
            </p>
          </section>
          <section aria-labelledby="now-learning">
            <p className="eyebrow">02 / Learning</p>
            <h2 id="now-learning">Beyond a working application.</h2>
            <p>
              I’m studying cloud infrastructure and delivery: how to package,
              deploy and operate what I build. CampusDesk is the practical
              setting for that work. Data structures, algorithms and
              system-design fundamentals are also part of the longer plan.
            </p>
          </section>
          <section aria-labelledby="now-thinking">
            <p className="eyebrow">03 / Thinking about</p>
            <h2 id="now-thinking">Making the reasoning visible.</h2>
            <p>
              I’m turning project decisions into case studies and engineering
              notes. I want the work to show what I tried, what failed, and what
              the evidence changed—not just which tools I used.
            </p>
          </section>
        </div>
        <aside className="now-aside">
          <p className="eyebrow">The longer view</p>
          <p>
            Build.
            <br />
            Understand.
            <br />
            Keep going.
          </p>
          <Link href="/about">
            More about my journey <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
