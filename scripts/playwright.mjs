import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const localBrowserCache = path.resolve(".playwright");
const env = { ...process.env };
if (!env.PLAYWRIGHT_BROWSERS_PATH && existsSync(localBrowserCache)) {
  env.PLAYWRIGHT_BROWSERS_PATH = localBrowserCache;
}
const child = spawn(
  process.execPath,
  ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)],
  { stdio: "inherit", windowsHide: true, env },
);
const stop = () => child.kill();
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
try {
  process.exitCode = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
}
