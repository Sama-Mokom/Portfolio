# Validation report

Validation was completed against the local production build on 22–23 September 2026. Generated reports and screenshots are ignored build artifacts; rerun the commands in the README to reproduce them.

## Automated checks

- Prettier, ESLint, strict TypeScript and the production build pass. The build produces 29 route entries: eight main pages, five case studies, two articles, six tag archives and machine/recovery routes; the contact page and endpoint are rendered dynamically.
- All 70 Vitest tests pass. They cover content invariants, metadata configuration, contact validation and request handling, theme/navigation behavior, the copy control and the contact form.
- Thirteen Playwright checks pass against the production server. They visit all 21 published content routes in light and dark themes, run axe against WCAG 2.2 AA rules, watch browser errors, resolve internal links and anchors, exercise the contact fallback, verify keyboard focus and reduced motion, and confirm content works without JavaScript.
- Responsive checks cover every published route at 320, 375, 768, 1024 and 1440 CSS pixels. No horizontal overflow was found. Full-page screenshots of the eight main pages were reviewed at mobile, tablet and desktop sizes; representative dark-theme pages were also reviewed.
- A source and generated-HTML privacy audit found no excluded employer, private contact/negotiation detail, private identifier, fabricated destination or unsupported percentage claim. All five studies expose every required section.
- The generated résumé PDF is two A4 pages. Both rendered pages were visually inspected for clipping, overlap, missing glyphs and page-break defects.

## Lighthouse lab results

The final local production measurements were:

| Route / profile      | Performance | Accessibility | Best practices | SEO |    LCP | CLS |    TBT |
| -------------------- | ----------: | ------------: | -------------: | --: | -----: | --: | -----: |
| Home / mobile        |          91 |           100 |            100 |  66 | 1.77 s |   0 | 372 ms |
| CampusDesk / mobile  |          78 |           100 |            100 |  63 | 3.06 s |   0 | 559 ms |
| Home / desktop       |          99 |           100 |            100 |  66 | 0.68 s |   0 |  94 ms |
| CampusDesk / desktop |          99 |           100 |            100 |  63 | 0.66 s |   0 |  87 ms |

These are throttled local lab samples, not field Core Web Vitals. The desktop runs meet the blueprint's 98 performance target; the mobile runs do not. The remaining mobile cost is dominated by the shared Next.js runtime and hydration under Lighthouse CPU throttling. Route prefetching was disabled and fonts use optional display, improving the home mobile run from 77 to 91. The case-study result remains below target and must not be described as passing the blueprint budget. The three local font files total 121,048 bytes (118.2 KiB), within the 120 KiB font budget; the measured initial JavaScript transfer remains above the blueprint's 90 KB target.

SEO's only failed scored audit is crawlability. This is intentional in an unconfigured preview: pages emit `noindex, nofollow`, `robots.txt` disallows crawling and canonical URLs are omitted. Set a valid HTTPS `SITE_URL`, rebuild, and rerun Lighthouse before launch. All other applicable Lighthouse SEO audits passed.

## Manual and external checks still required

- Run a screen-reader pass and browser zoom/forced-colors review on real target devices. Automated axe results do not replace assistive-technology testing.
- Measure field Core Web Vitals after deployment. Local Lighthouse cannot provide 75th-percentile field data or a meaningful INP result.
- Review and approve the authored copy and résumé. Supply publication-cleared screenshots, repository URLs and live demos if they should appear publicly.
- Configure the real production origin and, if desired, a verified Formspree endpoint. Without a provider, the contact form accurately prepares an unsent email draft.
- Recheck the current internship/location wording before public launch if timing has changed.

No external deployment, DNS change, analytics setup or message delivery was performed.
