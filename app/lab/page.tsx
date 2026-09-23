import Link from "@/components/link";
import { PageIntro } from "@/components/ui";
import { experiments } from "@/content/profile-secondary";
import { pageMetadata } from "@/lib/metadata";
import "../secondary.css";

export const metadata = pageMetadata(
  "Lab",
  "Small, real experiments in quantitative systems, browser automation, OAuth, cloud environments and document generation.",
  "/lab",
);

export default function LabPage() {
  return (
    <div className="container secondary-page lab-page">
      <PageIntro
        eyebrow="Experiments"
        title="A playground for ideas."
        description="Small tools, focused questions and things learned by trying. These are experiments, not finished products."
      />
      <div className="experiment-list">
        {experiments.map((experiment, index) => (
          <article
            className="experiment"
            key={experiment.id}
            id={experiment.id}
          >
            <div
              className={`experiment-visual experiment-visual-${experiment.visual}`}
              aria-hidden="true"
            >
              <span className="experiment-serial">
                Experiment / 0{index + 1}
              </span>
              {experiment.visual === "quant" ? (
                <div className="flow-visual">
                  <span>Hypothesis</span>
                  <i>→</i>
                  <span>Test</span>
                  <i>→</i>
                  <span>Review</span>
                </div>
              ) : experiment.visual === "compare" ? (
                <div className="compare-visual">
                  <span>WSL2</span>
                  <span>↔</span>
                  <span>Docker</span>
                </div>
              ) : experiment.visual === "document" ? (
                <div className="document-visual">
                  <span /> <i /> <i /> <i /> <i />
                </div>
              ) : (
                <div className="flow-visual">
                  <span>Input</span>
                  <i>→</i>
                  <span>Process</span>
                  <i>→</i>
                  <span>Check</span>
                </div>
              )}
              <span className="experiment-visual-caption">Process sketch</span>
            </div>
            <div className="experiment-meta">
              <span className="eyebrow">{experiment.year}</span>
              <span className="eyebrow">0{index + 1}</span>
            </div>
            <h2>{experiment.title}</h2>
            <p>{experiment.summary}</p>
            <ul className="tags" aria-label="Technologies">
              {experiment.tools.map((tool) => (
                <li className="tag" key={tool}>
                  {tool}
                </li>
              ))}
            </ul>
            <details className="experiment-notes">
              <summary>Read experiment notes</summary>
              <p>{experiment.detail}</p>
              {"href" in experiment && (
                <Link href={experiment.href}>
                  {experiment.link} <span aria-hidden="true">↗</span>
                </Link>
              )}
            </details>
          </article>
        ))}
      </div>
      <p className="lab-closing">
        For the longer engineering stories,{" "}
        <Link href="/work">explore the selected work</Link>.
      </p>
    </div>
  );
}
