# Vercel Deployment Guide

The active portfolio application is deployed on Vercel at `https://samamokom.vercel.app`.

## Build and runtime

Vercel auto-detects the Next.js App Router configuration from `package.json` and `next.config.ts`:

- **Framework Preset:** Next.js
- **Node.js Version:** 22.x (per `engines.node` in `package.json`)
- **Install Command:** `npm ci`
- **Build Command:** `npm run build`

This application is not a static export because it serves `POST /api/contact`, dynamic Open Graph images (`/opengraph-image`), and Next Image optimization.

## Environment variables (Production)

Configure these in **Vercel → Project → Settings → Environment Variables** scoped to **Production**:

- `SITE_URL`: `https://samamokom.vercel.app` (bare HTTPS origin with no path, query, credentials, or fragment). Leaving `SITE_URL` unset on **Preview** deployments is intentional so preview URLs emit `noindex, nofollow`, omit canonical links, and disallow crawler indexing in `/robots.txt`.
- `CONTACT_FORM_ENDPOINT`: verified `https://formspree.io/f/<id>` endpoint used by `POST /api/contact`. Without it, the contact page falls back to preparing a `mailto:` draft.
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: public Umami Cloud website ID (`53af9aa7-911f-4e0f-ad64-fc708e15bdb9`, stored as a Vercel `Config` variable in Production). The Umami script loads only when `VERCEL_ENV === "production"` and this variable is set.
- `GOOGLE_SITE_VERIFICATION` _(optional)_: Google Search Console HTML-tag verification token.

## Pre-deploy verification

Run the full quality gate locally before pushing to `main`:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run test:production
```

## Post-deploy checks

1. Confirm `https://samamokom.vercel.app/robots.txt` allows `/` and lists `Sitemap: https://samamokom.vercel.app/sitemap.xml`.
2. Confirm the homepage `<link rel="canonical">` resolves to `https://samamokom.vercel.app`.
3. To exclude your own visits from Umami analytics on a browser, open the live site and run in DevTools Console:
   ```js
   localStorage.setItem("umami.disabled", "1");
   ```
