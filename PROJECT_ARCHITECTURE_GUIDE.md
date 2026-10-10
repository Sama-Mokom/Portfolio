# Portfolio project architecture guide

This is a map of the repository as it stands on the `revamp` branch. Its active application is a **Next.js 16 portfolio**, written in strict TypeScript and React 19. It uses the App Router, has no database or CMS, and keeps its published projects and articles in typed TypeScript files.

The short version: content starts in `content/`, helpers and policy live in `lib/`, routes live in `app/`, reusable display and interactive pieces live in `components/`, and the visual system lives in `styles/` plus `app/secondary.css`.

## 1. How a request moves through the site

```text
Visitor requests a URL
        |
        v
app/ route file renders the page
        |
        +--> imports canonical content from content/
        +--> imports shared rules/helpers from lib/
        +--> composes reusable UI from components/
        |
        v
app/layout.tsx supplies global fonts, header, footer, skip link and global CSS
        |
        v
Next.js produces HTML; small client components add interaction where needed
```

The design intentionally keeps most pages as server-rendered/static React components. Only controls that need browser APIs use the `"use client"` directive: navigation/theme controls, contents tracking, code copy, printing, form handling, and About’s section tracker. This keeps initial JavaScript smaller and means the substantive portfolio content remains usable without JavaScript.

## 2. The folder map and the first place to look

| Need | First place to edit | What it controls |
| --- | --- | --- |
| Add or rewrite a featured case study | `content/projects.ts` | Project facts, sections, links, architecture diagram labels, decisions, and related writing. |
| Add or rewrite a post | `content/articles.ts` | Post metadata, body sections, tags, optional example code, and related projects/posts. |
| Change biography, experience, skills, smaller work or experiments | `content/profile.ts` and `content/profile-secondary.ts` | Structured profile data reused by several pages. |
| Change a page’s layout or static copy | Corresponding `app/.../page.tsx` | The route-specific page composition. |
| Change navigation or footer links | `components/site-header.tsx` / `components/site-footer.tsx` | Site-wide chrome. |
| Change a reusable card, diagram, tag, heading, link or reader control | `components/` | Reused presentation/interaction units. |
| Change colors, type scale, spacing, common page styling | `styles/tokens.css`, then `styles/globals.css` | Theme tokens and shared page styles. |
| Change About, Contact, Lab, Now, or Résumé-specific styling | `app/secondary.css` | The secondary-page visual layer. |
| Change title/description/canonical/social metadata behavior | `lib/metadata.ts` | Metadata policy used by every route. |
| Change form validation or delivery policy | `lib/contact.ts` and `app/api/contact/route.ts` | Shared form rules and the server endpoint. |
| Change paths exposed to crawlers / RSS subscribers | `app/robots.ts`, `app/sitemap.ts`, `app/rss.xml/route.ts` | Search-engine and feed output, driven from content. |

## 3. `app/`: routes, global shell and server capabilities

Next App Router maps this folder structure directly to URLs. A `page.tsx` serves a page, a `route.ts` serves an endpoint, and special filenames such as `layout.tsx`, `not-found.tsx`, and `error.tsx` have framework-defined roles.

### Root shell

- `app/layout.tsx` is the outer HTML document for every route. It loads locally bundled Newsreader, Inter and IBM Plex Mono font files from installed Fontsource packages; imports `styles/globals.css`; and places the shared `SiteHeader`, `main`, skip link, and `SiteFooter` around route content.
  - It also runs a tiny pre-hydration theme script in `<head>`. That script selects a saved `localStorage` theme or the system preference before paint, which avoids a light/dark flash. Keep the script and header’s theme logic aligned if changing the theme storage key or behavior.
  - It sets the metadata base from `lib/metadata.ts` and exposes the RSS alternate feed.
- `app/page.tsx` is `/`, the home page. It explicitly selects the `campusdesk`, `goldstrat`, and `netinsight` records for the three home cards; shows the first two articles; adds Person JSON-LD; and contains the home-only copy, portrait, calls to action, status strip, and section ordering. Change the selected-work order here; change card data in `content/projects.ts`.
- `app/icon.svg` provides the application favicon.
- `app/not-found.tsx` is the shared 404 page.
- `app/error.tsx` is the client-side route error boundary. `reset()` lets a visitor retry rendering after a recoverable route error.
- `app/opengraph-image.tsx` generates `/opengraph-image` dynamically as a 1200×630 PNG. Its words and inline colors are separate from normal CSS because `next/og` renders an image, not the website DOM.

### Informational pages

- `app/about/page.tsx` is `/about`. It mixes page-specific narrative with `experience` from `content/profile.ts` and `journey`/`skillGroups` from `content/profile-secondary.ts`. Its page-only styles come from `app/secondary.css`.
- `app/about/section-index.tsx` is a client component used only by About. It observes the six main sections using `IntersectionObserver`, highlights the current anchor, and provides in-page navigation. Add a section here **and** in the page markup if it should participate in the index.
- `app/now/page.tsx` is `/now`. It deliberately keeps the current snapshot as page copy rather than content data. Update its `updated` constant and the three narrative blocks together. In development it shows a reminder after 60 days, helping prevent a stale “Now” page.
- `app/lab/page.tsx` is `/lab`. It maps `experiments` from `content/profile-secondary.ts` to expandable experiment cards. The `visual` field selects one of four CSS/HTML process sketches; `href` and `link` are optional related links.
- `app/resume/page.tsx` is `/resume`. It reuses the experience and skills collections and supplies the remaining résumé copy in the route. At request/build time it checks whether `public/mokom-resume.pdf` exists and, if so, shows its calculated KB size and download button. `PrintButton` lets the browser print the HTML résumé.
- `app/contact/page.tsx` is `/contact`. It renders contact/location/social copy plus `ContactForm`. It reads `?status=...` for non-JavaScript form results and determines whether direct delivery is available by validating `CONTACT_FORM_ENDPOINT`.

### Work routes

- `app/work/page.tsx` is `/work`. It lists **all** project records from `content/projects.ts`, then `otherWork` from `content/profile.ts`. The route controls the list layout; the content file controls what appears in it.
- `app/work/[slug]/page.tsx` is the case-study template for `/work/<project-slug>`. It statically generates one route for each project record and rejects unknown project paths (`dynamicParams = false` plus `notFound()`). It builds the table of contents, structured data, architecture illustration, decision blocks, links to related articles, and “next project” navigation from the project object.
  - To add a project, add a valid record to `projects`. The route, work index, sitemap, and static parameters follow automatically. Its generated `thumbnail` artwork is reused by the listing card and case-study hero.

### Writing routes

- `app/writing/page.tsx` is `/writing`. It shows all tags, promotes the first item in the `articles` array as “Latest”, and renders the remainder as `WritingRow`s. Article ordering is therefore meaningful: keep the newest post first.
- `app/writing/[slug]/page.tsx` is the article template at `/writing/<article-slug>`. It statically generates all article paths, renders an optional code block after the second section, a contextual reasoning diagram after the third section, related work links, reader controls, JSON-LD, and next-article navigation.
- `app/writing/tags/[tag]/page.tsx` is the static archive at `/writing/tags/<tag>`. Valid tag pages are derived from `allTags`; unknown tags return 404.

### API, machine-readable, and crawler routes

- `app/api/contact/route.ts` owns `POST /api/contact` and must stay server-side. It has the most security-sensitive workflow in the repository:
  1. accepts only same-origin submissions and rejects cross-site requests;
  2. limits the raw form body to 96,000 bytes, including chunked bodies;
  3. reads/normalizes fields and applies the shared validation rules;
  4. rejects the hidden `website` honeypot;
  5. if a valid Formspree endpoint is configured, submits a minimal JSON payload with a 10-second timeout and no redirects;
  6. otherwise returns a truthful email-draft fallback instead of claiming a message was sent.

  JSON clients receive JSON errors/statuses; normal HTML forms receive redirects or a safe standalone fallback page. If switching provider, change both endpoint validation in `lib/contact.ts` and this delivery block.
- `app/rss.xml/route.ts` creates a static RSS 2.0 feed from `content/articles.ts`. It escapes XML and includes article sections plus optional code. Do not insert already-escaped HTML into article content: the route escapes raw strings itself.
- `app/sitemap.ts` creates `/sitemap.xml` from main pages, all project slugs, article slugs, and tags. It returns no sitemap until a valid production URL is configured.
- `app/robots.ts` lets crawlers access public pages and excludes `/api/` only when production URL configuration exists; preview/unconfigured environments disallow all crawling.

## 4. `components/`: reusable UI and carefully scoped browser behavior

| File | Responsibility | Practical edit guidance |
| --- | --- | --- |
| `link.tsx` | Wraps Next’s `Link` with `prefetch={false}`. | All internal links use this to avoid downloading pages before the visitor asks—an intentional metered-connection decision. Do not replace it casually with raw `next/link` if that policy should remain global. |
| `site-header.tsx` | Primary nav, route highlighting, theme switcher, mobile dialog/menu, focus handling, no-JS nav fallback. | Update its `links` array for main navigation. Theme preference is stored under `localStorage.theme`. Its dialog locks scroll, restores focus on close, and traps Tab at the ends. |
| `site-footer.tsx` | Shared navigation, external profiles, location, build/updated text, RSS and accessibility links. | Update the footer’s explicit “Updated” date when appropriate; it does not derive it from content. |
| `ui.tsx` | `Arrow`, `PageIntro`, `SectionHeading`, and `Tags`. | Use these first for common headings/tags/icons, so visual markup stays consistent. |
| `project-card.tsx` | Project preview used on the home and work pages. | Combines generated thumbnail artwork, title/tagline, first three technologies and external project links. |
| `project-media.tsx` | Shared case-study hero media. | Reuses each project's generated `thumbnail` and `thumbnailAlt` fields so cards and detail pages cannot drift to different media. |
| `project-links.tsx` | Optional repository/live external links. | Treat `null` as intentionally unavailable; it renders nothing when both links are absent. |
| `writing-row.tsx` | Compact article listing. | Formats a UTC date and calculates reading time using the shared helper. |
| `reading-tools.tsx` | Article/case-study scroll progress plus desktop/mobile contents navigation. | Client-side `IntersectionObserver` marks the visible heading. Supply stable, unique section IDs. |
| `code-block.tsx` | Accessible optional code example and Copy button. | Uses the Clipboard API, then announces success/failure to assistive technology. It does not perform syntax highlighting. |
| `contact-form.tsx` | Client enhancement for the contact form. | Validates before sending, focuses error summaries, supports 15-second request cancellation, submits to `/api/contact`, and falls back to a `mailto:` draft if direct delivery is unavailable. Keep its validation imports shared with the route—client checks are not the security boundary. |
| `print-button.tsx` | Browser print trigger for the résumé. | The print layout is defined in `app/secondary.css`, not here. |

## 5. `content/`: the portfolio’s canonical data layer

There is no CMS or remote content service. These modules are the single source of truth for published data. They are intentionally TypeScript rather than Markdown so routes can reliably compose cross-links, diagrams, metadata, and validation rules.

- `content/projects.ts` defines the `Project`, `ContentSection`, and `ProjectDecision` contracts and contains five detailed case studies:
  - `campusdesk`
  - `goldstrat`
  - `netinsight`
  - `cameroon-music-industry-platform`
  - `educlynk`

  A project includes identity/status/technology metadata, optional public repository and live URLs, rich sections, a simple architecture node list, at least two decisions, and `relatedWriting` slugs. The home page’s cards and every Work page use this same collection. The `featured` property is defined and validated but the current home selection is hard-coded by slug; changing `featured` alone will not alter the home page.

- `content/articles.ts` defines `Article` and contains two posts: `a-claim-is-more-than-a-check` and `when-a-backtest-changes-your-mind`. An article owns title, summary, ISO date, lowercase tags, body sections, cross-links, and optional illustrative code. New posts automatically affect reading/tag archives, RSS, sitemap, static route generation, and related links, but must be placed in the desired order in the array.

- `content/profile.ts` is the main profile data file. It holds the canonical identity/profile statement, introduction, education, experience, an older set of skill groups, journey information, interests, values, `otherWork`, `labEntries`, and `currentActivities`. In the current UI, `experience` and `otherWork` are directly consumed. Some other exports appear to be retained as structured source/reference and are not currently imported by an active page.

- `content/profile-secondary.ts` is the actively displayed extended-profile dataset. About and Résumé use its `journey` and `skillGroups`; Lab uses `experiments`. Prefer this file for changes visible on those pages.

- `content/requirements.ts` is an internal publishing checklist, not a rendered page. It records missing evidence/assets/links and configured requirements. It is useful before launch, but it is not currently imported by site UI or automated checks.

## 6. `lib/`: shared rules rather than display code

- `lib/content.ts` re-exports projects/articles; provides `getProject`, `getArticle`, `getArticlesByTag`, sorted `allTags`, and reading-time helpers; then validates all content immediately when the module is loaded.
  - `validateContent()` is a deliberate build-time safety net in addition to strict TypeScript. It checks non-empty text, lowercase hyphenated unique slugs, valid dates, public HTTPS links or `null`, section IDs, all 12 required case-study sections, architecture data, a minimum of two decisions, lowercase unique tags, and cross-references. A malformed content edit should fail visibly rather than publish a broken route.
  - The reading rate is 200 prose words/minute. Code is weighted at half the prose rate in article reading time.
- `lib/contact.ts` defines the one contact email, allowed subject values, normalized form-field type, 2–100-character name rule, basic email rule, 10–5,000-character message rule, safe `mailto:` builder, and an intentionally narrow Formspree URL allow-list. Update the contact email here to update form fallback, Contact page, résumé and footer-linked flows that use it.
- `lib/metadata.ts` validates `SITE_URL` as a bare HTTPS origin, exposes `siteUrl`/`hasProductionUrl`, and creates page-level metadata. With no production URL it deliberately uses localhost as an internal base but marks pages `noindex` and suppresses canonicals. Set the real site origin before a production build.

## 7. Styling, assets, and accessibility

### Stylesheets

- `styles/tokens.css` defines the design tokens: light and dark colors, typography variables, spacing/radius/layout-related variables, plus a system-dark fallback. Use this first for a global visual-system change.
- `styles/globals.css` imports tokens and contains reset/base rules, global typography, accessible focus/skip link, header/menu, home, Work, Writing, footer, prose/case-study, table-of-contents, diagrams, code block, responsive breakpoints, reduced-motion/forced-color support, and a basic print layer. It is loaded once by `app/layout.tsx`.
- `app/secondary.css` is imported by About, Contact, Lab, Now, and Résumé routes. It supplies their two-column layouts, form feedback, timeline/experiment visuals, responsive layouts, and the detailed résumé print rules. It is not a CSS module—selectors are global—so scope any additions carefully.

The responsive breakpoints are principally at 1100px, 900px/767px, and 640px depending on the stylesheet. Motion is restricted with `prefers-reduced-motion`; keyboard focus and forced-colors have explicit rules. These choices are reinforced by tests.

### Public assets

- `public/media/mokom-portrait.webp` is the live portrait. It is served at `/media/mokom-portrait.webp` and displayed with `next/image` on Home and About.
- `public/mokom-resume.pdf` is the downloadable résumé at `/mokom-resume.pdf`. `npm run resume:pdf` replaces it by printing the live `/resume` page. Review it after regeneration.

Only `public/` is web-exposed by Next. Keep raw/private materials outside it.

## 8. Configuration, quality gates, and automation

- `package.json` defines the runtime contract (Node 22+) and scripts:
  - `dev`: Next development server on all interfaces.
  - `build` / `start`: production compilation and loopback production server.
  - `lint`, `typecheck`, `format:check`: static quality checks.
  - `test`: Vitest unit/component tests.
  - `test:e2e`: runs Playwright through the wrapper script.
  - `test:production`: starts production Next, waits for it, then runs browser tests.
  - `test:performance`: Lighthouse audits.
  - `resume:pdf`: browser-generates the downloadable PDF.
  - `check`: lint + typecheck + unit tests + production build.
- `next.config.ts` turns off the `X-Powered-By` header, permits two development origins, asks Next Image for AVIF/WebP, redirects legacy `/index.html` to `/`, and sets security headers globally.
- `tsconfig.json` enables strict, no-emit TypeScript and gives `@/*` the project-root alias used throughout the app.
- `eslint.config.mjs` combines Next Core Web Vitals and TypeScript rules and excludes generated/local/legacy paths from linting.
- `vitest.config.mts` uses jsdom for unit/component tests, registers the `@` alias, test setup, and a small worker count.
- `playwright.config.ts` configures Chromium E2E runs against `PLAYWRIGHT_BASE_URL` or localhost, stores failure artifacts, uses a project-local browser cache when present, and sets standard desktop Chrome defaults.
- `.env.example` documents the only expected server environment variables: `SITE_URL` and optional `CONTACT_FORM_ENDPOINT`. Copy to `.env.local`; do not expose secrets via `NEXT_PUBLIC_*`.
- `.gitignore`, `.prettierignore`, and `.prettierrc.json` keep generated artifacts, environment files, local browsers and formatting policy out of commits.

### Test and helper files

- `tests/unit/content.test.ts` verifies the content contract, links/references, required sections, and reading-time behavior.
- `tests/unit/contact.test.ts` covers input normalization/validation, mailto generation, and valid Formspree endpoint recognition.
- `tests/unit/contact-route.test.ts` tests contact endpoint success/failure cases, origin checks, oversized body checks, non-JS fallback, and forwarding behavior with mocks.
- `tests/unit/metadata.test.ts` verifies valid/invalid production URL behavior.
- `tests/components/site-header.test.tsx`, `contact-form.test.tsx`, and `code-block.test.tsx` cover interaction/accessibility semantics in isolated components.
- `tests/e2e/helpers.ts` derives published routes from actual project/article/tag data. This prevents browser coverage from drifting when content is added.
- `tests/e2e/pages.spec.ts` checks responsive layout, links/anchors/downloads, page metadata/feed/404 behavior, and accessibility scans.
- `tests/e2e/interactions.spec.ts` checks theme persistence/system updates, menu focus/Escape behavior, skip link, no-JavaScript disclosures, and reduced motion.
- `tests/e2e/contact.spec.ts` checks accessible error behavior and the no-JavaScript email-draft fallback.
- `tests/setup.ts` adds testing-library DOM matchers and cleanup.
- `scripts/playwright.mjs` starts the Playwright CLI while handling the local browser cache.
- `scripts/test-production.mjs` launches `next start`, waits for a server response, invokes the browser suite, and shuts the child process down.
- `scripts/lighthouse.mjs` audits requested/default routes, writes reports under ignored `artifacts/lighthouse/`, and cleans up only its temporary Chrome profile.
- `scripts/export-resume.mjs` uses Playwright to print `/resume` into `public/mokom-resume.pdf`.

## 9. Documentation and reference materials

- `README.md` is the current operational overview: install/run/test commands, active source structure, environment variables, hosting constraints and privacy boundaries. Start here for routine development.
- `docs/IMPLEMENTATION.md` and `docs/VALIDATION.md` capture implementation status and past validation results.
- `docs/CONTENT_REQUIREMENTS.md` mirrors the remaining content/evidence requirements in a reader-facing checklist.
- `REFFERENCE_MAP.md` and `MOCKUPS_MAP.md` map supplied visual references to the designed pages. Note the spelling of `REFFERENCE_MAP.md` in the actual filename.
- `OPTIMIZATION_CHECKLIST.md` is a broader pre-launch/operational checklist.
- `DEPLOYMENT.md` is a legacy static-site-oriented deployment guide. It includes options such as GitHub Pages/static Netlify that do **not** match this active app’s server endpoint and Next Image requirements. Treat the README’s deployment section as the current source of truth unless this file is updated.

## 10. Legacy/reference files at the repository root

These files are not imported by the active Next application and should not be changed to alter the live portfolio:

- `index.html`, `style.css`, and `script.js`: the historical standalone site implementation. Next only redirects requests for `/index.html` to `/`; it does not serve this markup as the current home page.
- `portfolio-blueprint.html`: original planning/blueprint reference, not a route.
- `portfolio-mockups-separated/`: desktop/mobile visual reference PNGs, not public runtime assets.
- `New headshot 2.jpg` and `Nkeng_Sama_Mokom_CV.pdf`: source/reference assets in the repository root, not public URLs. The live equivalents are the optimized WebP and `public/mokom-resume.pdf`.
- `robots.txt` and `sitemap.xml`: static legacy versions. The live Next application instead generates these at `/robots.txt` and `/sitemap.xml` from `app/robots.ts` and `app/sitemap.ts`.
- `googledae614625701565e.html`: a root-level Google verification file from the static-site setup. It is not in `public/`, so the active Next application does not expose it; move it into `public/` only if that verification is still required.
- `netlify.toml`: static-host/Spa-rewrite configuration from the older site. Its `publish = "."` and rewrite-to-`index.html` settings conflict with the current Next server application; do not deploy the active app with this configuration unchanged.
- `.blueprint-audit.txt`, `.headshot-review.jpg`, `.tools/`, `.playwright/`, `.next/`, test reports, and Lighthouse artifacts are local/generated or ignored support material, not portfolio source.

## 11. Safe recipes for common changes

### Add a case study

1. Add one `Project` object to `content/projects.ts`, using a unique lowercase hyphenated `slug`.
2. Include all 12 required section IDs: `context`, `problem`, `users`, `constraints`, `my-role`, `architecture`, `engineering-deep-dive`, `hard-problem`, `visual-evidence`, `outcome`, `current-state`, and `retrospective`.
3. Provide generated `thumbnail` artwork and accurate `thumbnailAlt` text.
4. Provide architecture nodes, at least two decisions, and `null` (not a fake URL) for unavailable repository/live links.
5. If it belongs on Home, add its slug to the `selected` array in `app/page.tsx`.
6. Run `npm run typecheck`, `npm test`, and `npm run build`. The listing, route, sitemap and static params should derive automatically.

### Add a writing post

1. Add an `Article` object in newest-first order to `content/articles.ts`.
2. Use a unique lowercase hyphenated slug, a real `YYYY-MM-DD` date, lowercase hyphenated unique tags, non-empty sections, and only existing cross-reference slugs.
3. Optionally provide `code`; it appears after body section two in the article template.
4. Run validation commands. Tags, tag archives, RSS, sitemap, related content, reading time, and static routes update automatically.

### Change the theme or shared visual language

1. Alter variables in `styles/tokens.css` for colors/fonts/spacing that should apply across the site.
2. Alter `styles/globals.css` for shared component or primary-page layout rules.
3. Alter `app/secondary.css` for About/Contact/Lab/Now/Résumé-specific layout.
4. Test both light and dark themes, mobile widths and keyboard focus. Preserve the reduced-motion and forced-colors behavior unless intentionally redesigning it.

### Change contact delivery

1. Put a verified `https://formspree.io/f/<id>` URL in `CONTACT_FORM_ENDPOINT` (locally, `.env.local`; in hosting, server environment settings).
2. The page will then label the form as a direct send flow and client JavaScript will call `/api/contact`.
3. Do not broaden the endpoint allow-list or claim success without confirming the provider response. Without configuration, email-draft fallback is intentional and honest.

### Change SEO / production domain

1. Set `SITE_URL` to exactly the production HTTPS origin—no path, query, credentials or fragment—before building.
2. `lib/metadata.ts` then enables canonicals/social URL metadata, `app/sitemap.ts` emits URLs, and `app/robots.ts` permits indexing.
3. Without it, preview builds deliberately stay `noindex`.

## 12. Important design choices worth preserving

- **Typed file content over a CMS:** appropriate for a small, carefully curated personal site; predictable, versioned, and build-validated.
- **Static-first pages:** projects/articles are known at build time and do not need a database or runtime fetch.
- **No automatic internal-link prefetching:** this is a deliberate bandwidth choice for metered or unreliable connections.
- **No invented project evidence:** project visuals are clearly labelled explanatory diagrams, while screenshot/evidence needs remain tracked in `content/requirements.ts`.
- **Progressive enhancement:** critical navigation and contact fallback remain understandable without JavaScript; browser enhancements add convenience rather than exclusive access.
- **Environment-gated production SEO and form delivery:** previews do not leak canonical URLs/indexing, and forms do not pretend to deliver messages when no delivery provider is configured.

## 13. Recommended daily workflow

```sh
npm ci
npm run dev
# edit content, routes, components, or styles
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

For browser coverage, install Chromium once with `npx playwright install chromium`, then use `npm run test:production`. Run `npm run test:performance` against a running local production server when measuring Lighthouse, and `npm run resume:pdf` when deliberately refreshing the downloadable résumé.

Before public deployment, review `README.md`, `content/requirements.ts`, and the distinction between the active Next deployment requirements and the legacy static-host files above.
