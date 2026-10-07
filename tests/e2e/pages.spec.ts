import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mainRoutes, publishedRoutes, ready, screenshotName } from "./helpers";

for (const theme of ["light", "dark"] as const) {
  test(`published pages are accessible in ${theme} theme`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(240_000);
    await page.addInitScript(
      (selectedTheme) => localStorage.setItem("theme", selectedTheme),
      theme,
    );
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of publishedRoutes()) {
      await test.step(route, async () => {
        await ready(page, route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const violations = (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .analyze()
        ).violations;
        expect(
          violations,
          `${route}: ${JSON.stringify(violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })))}`,
        ).toEqual([]);
        await expect(page.locator("body")).not.toContainText(
          /Landmark Software Solutions|lorem ipsum/i,
        );
        await page.screenshot({
          path: testInfo.outputPath(`${screenshotName(route)}-${theme}.png`),
          fullPage: true,
          animations: "disabled",
        });
      });
    }
    expect(errors, "browser console and uncaught errors").toEqual([]);
  });
}

test("all pages fit mobile, tablet, desktop and 400% equivalent widths", async ({
  page,
}, testInfo) => {
  test.setTimeout(300_000);
  const routes = publishedRoutes();
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await test.step(`${width}px ${route}`, async () => {
        await ready(page, route);
        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        }));
        expect(
          dimensions.document,
          `${route} document overflow at ${width}px`,
        ).toBeLessThanOrEqual(dimensions.viewport + 1);
        expect(
          dimensions.body,
          `${route} body overflow at ${width}px`,
        ).toBeLessThanOrEqual(dimensions.viewport + 1);
        if (mainRoutes.includes(route) && [375, 768, 1440].includes(width)) {
          await page.screenshot({
            path: testInfo.outputPath(`${screenshotName(route)}-${width}.png`),
            fullPage: true,
            animations: "disabled",
          });
        }
      });
    }
  }
});

test("internal links, downloads and section anchors resolve", async ({
  page,
  request,
}) => {
  test.setTimeout(240_000);
  const destinations = new Map<string, Set<string>>();
  for (const route of publishedRoutes()) {
    await ready(page, route);
    const links = await page.locator("a[href]").evaluateAll((elements) =>
      elements.map((element) => ({
        raw: element.getAttribute("href"),
        href: (element as HTMLAnchorElement).href,
      })),
    );
    for (const { raw, href } of links) {
      expect(raw, `empty placeholder link on ${route}`).not.toBe("#");
      expect(raw, `unsafe link on ${route}`).not.toMatch(/^javascript:/i);
      const url = new URL(href);
      if (url.origin !== new URL(page.url()).origin) continue;
      const path = url.pathname + url.search;
      const anchors = destinations.get(path) ?? new Set<string>();
      if (url.hash) anchors.add(decodeURIComponent(url.hash.slice(1)));
      destinations.set(path, anchors);
    }
  }
  for (const [path, anchors] of destinations) {
    const response = await request.get(path);
    expect(response.ok(), `${path} returns ${response.status()}`).toBe(true);
    if (anchors.size) {
      await page.goto(path);
      for (const anchor of anchors) {
        expect(
          await page.evaluate(
            (id) => Boolean(document.getElementById(id)),
            anchor,
          ),
          `${path}#${anchor}`,
        ).toBe(true);
      }
    }
  }
});

test("metadata, feed and not-found response are usable", async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  for (const route of mainRoutes) {
    await ready(page, route);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(8);
    expect(titles.has(title), `${route} has a distinct title`).toBe(false);
    titles.add(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S.{20,}/,
    );
    if (await page.locator('link[rel="canonical"]').count()) {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        /^https:\/\//,
      );
    } else {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
    }
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /\S/,
    );
  }
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const sitemapBody = await sitemap.text();
  if (sitemapBody.includes("<loc>")) {
    expect(await robots.text()).toMatch(/Sitemap:/i);
    const sitemapRoutes = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    );
    expect(sitemapRoutes).toEqual(expect.arrayContaining(mainRoutes));
  } else {
    expect(await robots.text()).toMatch(/Disallow: \/(?:\r?\n|$)/i);
  }
  await ready(page, "/writing");
  const feedHref = await page
    .locator('a[href*="rss"], a[href*="feed"]')
    .first()
    .getAttribute("href");
  expect(feedHref).toBeTruthy();
  const feed = await request.get(feedHref!);
  expect(feed.status()).toBe(200);
  expect(await feed.text()).toMatch(/<rss|<feed/);
  const missing = await page.goto("/this-route-does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /home|work/i }).first(),
  ).toBeVisible();
});
