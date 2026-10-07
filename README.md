# Mokom — personal portfolio

A responsive portfolio for Nkeng Sama Mokom, built with Next.js App Router, strict TypeScript, and locally hosted fonts. The supplied blueprint and mockups guide the implementation; factual content and privacy constraints take precedence over example copy and imagery.

## Run locally

Use Node.js 22 or newer and npm. From the project directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The original `index.html`, `style.css`, and `script.js` are retained as historical source; they are not the current application or served by Next.js. The original planning document and mockups are also outside the public directory.

## Validate

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:production
```

The production test runner starts a local server, runs Playwright and stops its server. Choose another `PORT` if 3000 is occupied. To inspect the production site and run browser checks against it separately:

```sh
npm run start
# In another terminal:
npm run test:e2e
node scripts/lighthouse.mjs
npm run resume:pdf
```

Tests cover content validation, contact validation and server behavior, interactive components, all published routes, light/dark accessibility, responsive reflow, internal links, keyboard navigation and progressive enhancement. Browser screenshots and reports go to ignored `test-results/` and `playwright-report/`; Lighthouse reports go to ignored `artifacts/lighthouse/`. Local Lighthouse measurements are not field Core Web Vitals.

The browser scripts use an existing project-local `.playwright/` cache when present, otherwise Playwright's normal cache. `PLAYWRIGHT_BASE_URL` overrides the running server address for browser tests, Lighthouse and PDF export. On PowerShell, for example: `$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:3100'`.

The résumé export requires the production server and writes `public/mokom-resume.pdf`. Review every page after regenerating it, then rebuild to update the displayed download size. Its compact print layout omits duplicated experience summaries and extra skill commentary; the full descriptions remain on the HTML page.

## Structure and editing

- `app/`: routes, metadata, feed, sitemap, error states and contact endpoint.
- `components/`: navigation, footer, project previews, article tools and contact form.
- `content/projects.ts`: five case studies, documented architecture and decisions.
- `content/articles.ts`: newly authored notes based on the supplied project record. Code examples are explicitly illustrative.
- `content/profile.ts`: canonical profile, experience and supporting content.
- `content/profile-secondary.ts`: expanded About and Lab narratives.
- `lib/content.ts`: validation, lookup and reading-time helpers. Invalid content fails the build.
- `styles/tokens.css`: colors, fonts, spacing and motion. `styles/globals.css` and `app/secondary.css` compose the pages.
- `public/media/`: the optimized genuine headshot. Project visuals are explanatory HTML diagrams, not fabricated screenshots.

Add a project or article to its typed content collection. Use unique lowercase slugs, complete required sections, valid dates and existing related-content slugs. `null` is the correct value for an unavailable demo or repository; never add a dummy URL. Article dates record publication, not the date of the underlying project. Tag archives, reading times, RSS and sitemap entries follow the content automatically.

No CMS, database, analytics, tracking scripts or runtime font CDN is required. Most pages are statically generated; the contact page and POST endpoint run on the server.

## Deployment configuration

Copy `.env.example` to `.env.local` for local configuration, or set the same values in the deployment platform. Environment files are ignored. Do not put secrets in `NEXT_PUBLIC_*` variables.

- `SITE_URL`: the actual HTTPS production origin, with no path, query, fragment or credentials. Invalid values fail the build. Leave unset for previews. Unconfigured previews deliberately use `noindex`, disallow crawlers and omit canonical URLs. Set this **before building** production so canonical, social, sitemap and feed links use the real domain.
- `GOOGLE_SITE_VERIFICATION`: optional Google Search Console HTML-tag verification token. Enter only the `content` value Google supplies; DNS verification does not require this setting.
- `CONTACT_FORM_ENDPOINT`: optional `https://formspree.io/f/…` endpoint. Without it, the form prepares a draft for the visitor's email app and explicitly says that the visitor must send it. With it, the server validates input and reports delivery success or failure. Formspree account setup, destination verification and abuse controls are deployment responsibilities.

Deploy to a compatible Node.js host or Vercel using `npm ci`, `npm run build`, and `npm run start`. The start script binds to loopback for local use; on a container host use `npx next start --hostname 0.0.0.0 --port 3000`. This app is not configured as a static export because it includes a contact endpoint and image optimization. `/index.html` permanently redirects to `/`; no other historical route mappings were supplied.

No deployment or DNS modification has been performed. Before public launch, supply the real origin, review authored content and the résumé, and complete the remaining source requirements in [the content checklist](docs/CONTENT_REQUIREMENTS.md). See [implementation status](docs/IMPLEMENTATION.md) and [validation results](docs/VALIDATION.md) for executed checks and limits.

## Assets and privacy

The genuine portrait is reused from the existing repository and optimized to WebP, with responsive AVIF/WebP delivery through Next Image. Newsreader, Inter and IBM Plex Mono are bundled from their Fontsource packages under their supplied open-font licenses. The original assets and planning files remain unmodified.

Only `public/` files are directly downloadable. Do not copy planning documents, private source repositories, raw survey data, credentials, unpublished screenshots or identifiers into that directory. Remaining repositories/screenshots/demos are documented in source and the content checklist.
