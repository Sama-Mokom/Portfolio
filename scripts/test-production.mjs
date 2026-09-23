import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT must be an integer between 1 and 65535.");
const baseURL = `http://127.0.0.1:${port}`;
await new Promise((resolve, reject) => {
  const probe = createServer();
  probe.once("error", () =>
    reject(
      new Error(
        `Port ${port} is already in use. Stop the existing server or choose another PORT.`,
      ),
    ),
  );
  probe.listen(port, "127.0.0.1", () => probe.close(resolve));
});
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    stdio: "inherit",
    windowsHide: true,
    env: process.env,
  },
);
let serverFailed = false;
let tests;
const stop = () => {
  tests?.kill();
  server.kill();
};
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
server.on("error", (error) => {
  console.error(error);
  serverFailed = true;
});
server.on("exit", () => {
  serverFailed = true;
});

try {
  const deadline = Date.now() + 60_000;
  let ready = false;
  while (Date.now() < deadline && !serverFailed) {
    try {
      const response = await fetch(baseURL, {
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Server is still starting. */
    }
    await delay(500);
  }
  if (!ready || serverFailed)
    throw new Error(
      "Production server did not become ready. Check whether the selected port is already in use.",
    );
  tests = spawn(
    process.execPath,
    ["scripts/playwright.mjs", ...process.argv.slice(2)],
    {
      stdio: "inherit",
      windowsHide: true,
      env: { ...process.env, PLAYWRIGHT_BASE_URL: baseURL },
    },
  );
  process.exitCode = await new Promise((resolve, reject) => {
    tests.on("error", reject);
    tests.on("exit", (code) => resolve(code ?? 1));
  });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  stop();
  process.removeListener("SIGINT", stop);
  process.removeListener("SIGTERM", stop);
}
