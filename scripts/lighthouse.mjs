import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { launch } from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";

const localBrowserCache = path.resolve(".playwright");
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(localBrowserCache)) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = localBrowserCache;
}
const { chromium } = await import("playwright");

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const routes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/", "/work/campusdesk"];
const output = "artifacts/lighthouse";
await mkdir(output, { recursive: true });
const profileRoot = path.resolve(output);
const userDataDir = await mkdtemp(path.join(profileRoot, ".chrome-"));
const chrome = await launch({
  userDataDir,
  chromePath: chromium.executablePath(),
  chromeFlags: [
    "--headless=new",
    "--disable-gpu",
    ...(process.env.CI ? ["--no-sandbox"] : []),
  ],
  logLevel: "error",
});

const reports = [];
try {
  for (const formFactor of ["mobile", "desktop"]) {
    for (const route of routes) {
      const result = await lighthouse(
        new URL(route, baseURL).href,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
        },
        formFactor === "desktop" ? desktopConfig : undefined,
      );
      if (!result || result.lhr.runtimeError)
        throw new Error(
          result?.lhr.runtimeError?.message ?? "Lighthouse returned no report",
        );
      const name = `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${formFactor}`;
      await writeFile(
        `${output}/${name}.json`,
        JSON.stringify(result.lhr, null, 2),
      );
      const screenshot = result.lhr.audits["final-screenshot"]?.details?.data;
      if (screenshot)
        await writeFile(
          `${output}/${name}.jpg`,
          Buffer.from(screenshot.split(",")[1], "base64"),
        );
      const scores = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([category, value]) => [
          category,
          Math.round((value.score ?? 0) * 100),
        ]),
      );
      const metrics = Object.fromEntries(
        [
          "largest-contentful-paint",
          "cumulative-layout-shift",
          "total-blocking-time",
          "first-contentful-paint",
        ].map((metric) => [metric, result.lhr.audits[metric]?.numericValue]),
      );
      const report = {
        route,
        formFactor,
        scores,
        metrics,
        report: `${output}/${name}.json`,
      };
      reports.push(report);
      console.log(JSON.stringify(report));
    }
  }
  await writeFile(
    `${output}/summary.json`,
    JSON.stringify(
      { measuredAt: new Date().toISOString(), baseURL, reports },
      null,
      2,
    ),
  );
  if (
    reports.some(
      ({ scores }) =>
        scores.performance < 98 ||
        scores.accessibility < 100 ||
        scores["best-practices"] < 100 ||
        scores.seo < 100,
    )
  ) {
    console.error(
      "A blueprint Lighthouse target (98/100/100/100) was missed; inspect the stored reports. Unconfigured previews intentionally fail crawlability. These are local lab measurements, not field Core Web Vitals.",
    );
    process.exitCode = 1;
  }
} finally {
  await chrome.kill();
  // Delete only this audit's generated profile, never a user's browser data.
  if (path.dirname(path.resolve(userDataDir)) !== profileRoot)
    throw new Error(
      "Refusing to clean a browser profile outside the audit folder.",
    );
  try {
    await rm(userDataDir, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 300,
    });
  } catch (error) {
    console.warn(
      `Chrome retained a locked audit profile at ${userDataDir}: ${error.message}`,
    );
  }
}
