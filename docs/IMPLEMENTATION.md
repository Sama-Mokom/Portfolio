# Implementation checklist

## Audit and decisions

- [x] Read the full blueprint and all 17 supplied mockups. The maps list additional images which are not supplied.
- [x] Inventory original app: static index.html, 849-byte CSS, theme script, one genuine headshot. No framework, package manager lockfile, tests, deployment config, or package.json.
- [x] Baseline: `node --check script.js` passes. npm lint/typecheck/test/build cannot run because package.json did not exist. Preserve original source for reference; Next serves only app/public.
- [x] Preserve user deletions and untracked planning documents. No destructive Git operations.
- [x] Visual conflicts: light/dark home mockups show different copy, portraits and project names. Use one stable factual content model, light mockup composition, separately tuned themes. Original headshot replaces illustrated/mockup portraits. No fake project screenshots or logo strip. The user's ban on generic technology-logo clouds wins over mockups.
- [x] Content conflicts: disregard mockup metrics, email, fictional project names, dated articles, wrong tech badges and invented lab projects. Use supplied original contact links and verified blueprint facts. No private planning details are bundled.
- [x] Missing pages / breakpoints inherit the supplied serif typography, ruled sections and responsive composition; these are derived implementations, not claims of exact missing references.
- [x] No existing framework to preserve: introduce App Router + strict TypeScript. Typed content modules replace an unnecessary MDX/CMS pipeline for this small structured collection. Server components render content at build time.
- [x] Foundation/design system validated.
- [x] Structured content validated against source and privacy rules.
- [x] Routes, responsive states and interactions complete.
- [x] Optimized genuine portrait; accessible authored architecture illustrations.
- [x] Keyboard, themes, contact, disclosures, code copy and reduced motion verified.
- [x] Formatting, lint, types, unit/component tests and production build pass.
- [x] Automated accessibility, responsive/overflow, links, console and Lighthouse checks executed. See `VALIDATION.md` for the local mobile performance shortfall.
- [x] SEO, machine routes, documentation and deployment configuration verified. Production indexing remains disabled until `SITE_URL` is set.

## Route checklist

Shared requirements: 320/375/768/1024/1440 reflow, one h1, skip navigation, semantic landmarks, visible keyboard focus, light/dark, minimum 44px controls, no motion dependency, descriptive links, no fabricated media.

- [x] `/`: home desktop light/dark, tablet light/dark, mobile light/dark. Portrait hero, verified positioning, exactly three selected projects, two notes, current activity and contact. Responsive stacked hero; theme/menu states.
- [x] `/work`: work desktop/mobile. Five complete case-study entries, other work, lab link. Approved card proportions with larger editorial study entries; responsive stacking. Authored diagrams replace unavailable screenshots.
- [x] `/work/[slug]`: CampusDesk desktop/mobile template extended to five studies. Header, summary/context/problem/users/constraints/role/architecture/decisions/deep dive/hard problem/evidence/outcome/current state/retrospective/next links. Desktop marginal and mobile disclosure index, progress, native detail states.
- [x] `/about`: about desktop/mobile. Narrative, genuine portrait, anchored journey/experience/education/skills/beyond/values, accessibility statement. Responsive index and timeline.
- [x] `/writing`: writing desktop/mobile. Featured note and editorial list, real tags and RSS. No invented article photography or publication dates.
- [x] `/writing/[slug]`, `/writing/tags/[tag]`: no supplied mockup. Editorial prose, contents, progress, illustrative code labelled, related content, static tag archives.
- [x] `/lab`: desktop reference, derived mobile. Real experiments only, dense responsive entries with documented unavailable repositories.
- [x] `/now`: desktop reference, derived mobile. Dated building/learning/thinking, under 300 words.
- [x] `/contact`: desktop reference, derived mobile. Existing email/social links, visible labels, validation and honest mail-draft fallback; optional configured delivery.
- [x] `/resume`: no supplied reference. Verified HTML CV, print styles and a visually reviewed two-page PDF export.
- [x] Not-found and error recovery; server-rendered content does not depend on a loading boundary or JavaScript.
- [x] RSS/sitemap/robots/social preview: no invented public domain; production origin documented.

## Remaining source requirements

Project repositories and publication permissions; actual product screenshots and original engineering artifacts; confirmed live project demos; production domain; optional form delivery account; final CV review. The mockup portraits, dashboard screenshots and graphs are design references, not project evidence. A real-device and assistive-technology audit needs hardware unavailable to this environment.
