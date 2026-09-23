import { expect, type Page } from "@playwright/test";
import { articles, projects, allTags } from "../../lib/content";

export const mainRoutes = [
  "/",
  "/work",
  "/about",
  "/writing",
  "/lab",
  "/now",
  "/contact",
  "/resume",
];

export function publishedRoutes(): string[] {
  const routes = [
    ...mainRoutes,
    ...projects.map(({ slug }) => `/work/${slug}`),
    ...articles.map(({ slug }) => `/writing/${slug}`),
    ...allTags.map((tag) => `/writing/tags/${tag}`),
  ];
  expect(routes).toEqual(expect.arrayContaining(mainRoutes));
  expect(routes.filter((route) => /^\/work\/[^/]+$/.test(route))).toHaveLength(
    5,
  );
  expect(routes.some((route) => /^\/writing\/[^/]+$/.test(route))).toBe(true);
  expect(new Set(routes).size).toBe(routes.length);
  return routes;
}

export async function ready(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: "networkidle" });
  expect(response?.status(), `${route} response`).toBe(200);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
}

export function screenshotName(route: string) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}
