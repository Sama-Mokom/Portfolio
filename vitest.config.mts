import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.ts", "tests/components/**/*.test.tsx"],
    setupFiles: ["tests/setup.ts"],
    maxWorkers: 2,
    restoreMocks: true,
    clearMocks: true,
  },
});
