import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publishedRoutes, ready } from "./helpers";

test("system theme changes apply until the reader chooses a preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await ready(page, "/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: /switch to dark theme/i }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("theme choice persists after navigation and reload", async ({ page }) => {
  await ready(page, "/");
  const before = await page.locator("html").getAttribute("data-theme");
  const toggle = page
    .getByRole("button", { name: /theme|switch to (light|dark)/i })
    .first();
  await toggle.click();
  const selected = before === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-theme", selected);
  await ready(page, "/about");
  await expect(page.locator("html")).toHaveAttribute("data-theme", selected);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", selected);
});

test("a persisted dark theme can switch to light and remain light", async ({
  page,
}) => {
  await ready(page, "/");
  await page.evaluate(() => localStorage.setItem("theme", "dark"));
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const darkBackground = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const lightBackground = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(lightBackground).not.toBe(darkBackground);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
    "light",
  );

  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(
    await page.evaluate(() => getComputedStyle(document.body).backgroundColor),
  ).toBe(lightBackground);
});

test("mobile menu traps focus, closes on Escape and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await ready(page, "/");
  const openButton = page
    .getByRole("button", { name: /open.*menu|menu/i })
    .first();
  await openButton.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const violations = (
    await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze()
  ).violations;
  expect(violations).toEqual([]);
  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
      "focus remains in the modal navigation",
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(openButton).toBeFocused();
  await openButton.click();
  await dialog.getByRole("link", { name: /^about$/i }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(dialog).not.toBeVisible();
});

test("keyboard users can skip to main content", async ({ page }) => {
  await ready(page, "/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip.*content/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe(
    "MAIN",
  );
});

test("content and native disclosures remain usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  try {
    for (const route of publishedRoutes()) {
      await ready(page, route);
      expect(
        (await page.locator("main").innerText()).trim().length,
        `${route} has server-rendered content`,
      ).toBeGreaterThan(100);
    }
    await ready(page, "/work");
    const studyHref = await page
      .locator('main a[href^="/work/"]')
      .first()
      .getAttribute("href");
    expect(studyHref).toBeTruthy();
    await ready(page, studyHref!);
    const disclosure = page.locator("details").first();
    await expect(disclosure).toBeVisible();
    await disclosure.locator("summary").click();
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(
      page.getByRole("link", { name: /^work$/i }).first(),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("reduced motion does not hide content or delay navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page, "/");
  await expect(page.locator("h1")).toBeVisible();
  const animated = await page.evaluate(
    () =>
      document.getAnimations().filter((animation) => {
        const duration = animation.effect?.getComputedTiming().duration;
        return (
          animation.playState === "running" &&
          typeof duration === "number" &&
          duration > 100
        );
      }).length,
  );
  expect(animated).toBe(0);
  await page
    .locator("header")
    .getByRole("link", { name: /^work$/i })
    .click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.locator("h1")).toBeVisible();
});
