import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(".playwright")) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.resolve(".playwright");
}
const { chromium } = await import("playwright");
const base = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ colorScheme: "light" });
  const response = await page.goto(`${base}/resume`, {
    waitUntil: "networkidle",
  });
  if (!response?.ok()) throw new Error("The résumé route is unavailable.");
  await page.evaluate(() => document.fonts.ready);
  await mkdir("public", { recursive: true });
  await page.pdf({
    path: "public/mokom-resume.pdf",
    format: "A4",
    printBackground: true,
    tagged: true,
    outline: true,
    margin: { top: "15mm", right: "17mm", bottom: "17mm", left: "17mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate:
      '<div style="font-size:8px;width:100%;text-align:center;color:#505962">Nkeng Sama Mokom · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  });
  console.log(
    "Created public/mokom-resume.pdf from the verified HTML résumé. Rebuild to refresh its download size.",
  );
} finally {
  await browser.close();
}
