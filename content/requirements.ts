/** Internal publishing checklist. Do not render this as portfolio copy. */
export interface ContentRequirement {
  id: string;
  area: string;
  requirement: string;
  status: "needed" | "configured";
}

export const contentRequirements: ContentRequirement[] = [
  {
    id: "project-repositories",
    area: "All case studies",
    requirement:
      "Supply approved public repository URLs and confirm which project materials may be published. A known GitHub profile does not establish permission to link individual repositories.",
    status: "needed",
  },
  {
    id: "project-screenshots",
    area: "All case studies",
    requirement:
      "Supply genuine, publication-ready screenshots. Current code-authored diagrams are explanatory reconstructions of documented facts, not screenshots or original exported diagrams.",
    status: "needed",
  },
  {
    id: "original-evidence",
    area: "Technical evidence",
    requirement:
      "Supply CampusDesk's original claim implementation and concurrency trace, NetInsight's SRS and original diagrams, GoldStrat backtest exports, and permissioned EducLynk contribution evidence before publishing source extracts, result charts or proprietary screens.",
    status: "needed",
  },
  {
    id: "project-live-links",
    area: "Project demos",
    requirement:
      "Confirm current public demos. The original index contains an X-Clusive Render URL; do not imply it is currently live without verification. No invented project hosts or repository links.",
    status: "needed",
  },
  {
    id: "resume-pdf",
    area: "Resume",
    requirement:
      "A tagged PDF is generated from the verified HTML resume and visually checked. Review it before launch, or replace it with a separately approved CV at public/mokom-resume.pdf.",
    status: "configured",
  },
  {
    id: "production-domain",
    area: "Deployment",
    requirement:
      "Set the real production origin before public deployment so canonical, sitemap, RSS and social URLs use the confirmed domain.",
    status: "needed",
  },
  {
    id: "message-delivery",
    area: "Contact",
    requirement:
      "Configure the chosen contact-delivery provider if direct server delivery is required. Until configured, use an explicitly labelled email-client flow with no false sent confirmation.",
    status: "needed",
  },
  {
    id: "first-internship-dates",
    area: "Experience",
    requirement:
      "The first V-Groups internship is confirmed as June 2025 — August 2025.",
    status: "configured",
  },
  {
    id: "portrait",
    area: "About",
    requirement:
      "Reuse the supplied professional headshot and optimise it for web delivery. Do not generate or substitute a photograph of the author.",
    status: "configured",
  },
  {
    id: "profile-links",
    area: "Contact",
    requirement:
      "Public GitHub, LinkedIn and email values come from the original portfolio index. Omit placeholder social links and unnecessary contact identifiers.",
    status: "configured",
  },
  {
    id: "new-writing",
    area: "Writing",
    requirement:
      "The two notes are newly authored on 21 September 2026 from the supplied work record. Dates are not assertions of earlier publication; illustrative pseudocode is clearly identified.",
    status: "configured",
  },
];
