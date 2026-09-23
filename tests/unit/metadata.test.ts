import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("deployment metadata", () => {
  it.each([
    "https://",
    "http://portfolio.example",
    "https://portfolio.example/path",
    "https://portfolio.example?query=value",
    "https://portfolio.example/#fragment",
    "https://user:password@portfolio.example",
  ])("rejects an invalid production origin: %s", async (value) => {
    vi.stubEnv("SITE_URL", value);
    vi.resetModules();
    await expect(import("@/lib/metadata")).rejects.toThrow(
      "SITE_URL must be a valid HTTPS origin without a path.",
    );
  });

  it("keeps unconfigured previews out of search results without a fabricated canonical", async () => {
    vi.stubEnv("SITE_URL", undefined);
    vi.resetModules();
    const { hasProductionUrl, pageMetadata } = await import("@/lib/metadata");
    const metadata = pageMetadata(
      "Work",
      "Selected engineering projects.",
      "/work",
    );
    expect(hasProductionUrl).toBe(false);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBeUndefined();
    expect(metadata.openGraph?.url).toBeUndefined();
  });

  it("uses the configured HTTPS origin consistently for production metadata", async () => {
    vi.stubEnv("SITE_URL", "https://portfolio.example/");
    vi.resetModules();
    const { hasProductionUrl, pageMetadata } = await import("@/lib/metadata");
    const metadata = pageMetadata(
      "Work",
      "Selected engineering projects.",
      "/work",
    );
    expect(hasProductionUrl).toBe(true);
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe(
      "https://portfolio.example/work",
    );
    expect(metadata.openGraph?.url).toBe("https://portfolio.example/work");
    expect(metadata.openGraph?.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://portfolio.example/opengraph-image",
        }),
      ]),
    );
  });
});
