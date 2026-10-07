import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ready } from "./helpers";

test("invalid contact fields receive accessible, focused errors without sending", async ({
  page,
}) => {
  let posted = false;
  await page.route("**/api/contact", async (route) => {
    posted = true;
    await route.abort();
  });
  await ready(page, "/contact");
  await page
    .locator("form")
    .getByRole("button", { name: /prepare email|send message/i })
    .click();
  const errorSummary = page.locator("form").getByRole("alert");
  await expect(errorSummary).toBeFocused();
  for (const name of ["Name", "Email", "Message"]) {
    await expect(page.getByLabel(name, { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  }
  await errorSummary.getByRole("link").first().click();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  const violations = (
    await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze()
  ).violations;
  expect(violations).toEqual([]);
  expect(posted).toBe(false);
});

test("unconfigured contact works without JavaScript and prepares an unsent email link", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  try {
    await ready(page, "/contact");
    const prepare = page.getByRole("button", { name: /prepare email/i });
    test.skip(
      (await prepare.count()) === 0,
      "This environment has live delivery configured; avoid sending an actual enquiry.",
    );
    await page.getByLabel("Name", { exact: true }).fill("Ada & Company");
    await page
      .getByLabel("Email", { exact: true })
      .fill("ada+project@example.org");
    await page
      .getByLabel("Message", { exact: true })
      .fill("An accessible application & API enquiry.\nThank you!");
    await prepare.click();
    await expect(
      page.getByRole("heading", { name: "Your email draft is ready" }),
    ).toBeVisible();
    await expect(page.locator("main")).toContainText(
      "This website has not sent a message.",
    );
    const destination = await page
      .getByRole("link", { name: "Open your email draft" })
      .getAttribute("href");
    const email = new URL(destination!);
    expect(email.protocol).toBe("mailto:");
    expect(email.searchParams.get("body")).toContain(
      "accessible application & API",
    );
    expect(email.searchParams.get("body")).toContain("ada+project@example.org");
    expect(email.searchParams.get("subject")).toContain("Ada & Company");
  } finally {
    await context.close();
  }
});
