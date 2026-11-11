import { afterEach, describe, expect, it, vi } from "vitest";
import { Analytics } from "@/components/analytics";
import { track } from "@/lib/analytics";

describe("analytics track helper", () => {
  afterEach(() => {
    delete window.umami;
    vi.unstubAllEnvs();
  });

  it("does nothing when window.umami is absent", () => {
    expect(() =>
      track("article-read", { slug: "when-a-gateway-lacks-idempotency" }),
    ).not.toThrow();
    expect(() => track("cv-download")).not.toThrow();
  });

  it("passes event name and properties to window.umami.track when present", () => {
    const spy = vi.fn();
    window.umami = { track: spy };

    track("article-read", { slug: "when-a-gateway-lacks-idempotency" });
    expect(spy).toHaveBeenCalledWith("article-read", {
      slug: "when-a-gateway-lacks-idempotency",
    });

    track("contact-submit", { result: "sent" });
    expect(spy).toHaveBeenCalledWith("contact-submit", { result: "sent" });

    track("cv-download");
    expect(spy).toHaveBeenCalledWith("cv-download");
  });

  it("swallows errors thrown by the underlying tracker", () => {
    window.umami = {
      track: () => {
        throw new Error("network blocked");
      },
    };
    expect(() => track("contact-submit", { result: "failed" })).not.toThrow();
  });
});

describe("Analytics component", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null outside Vercel production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv(
      "NEXT_PUBLIC_UMAMI_WEBSITE_ID",
      "53af9aa7-911f-4e0f-ad64-fc708e15bdb9",
    );
    expect(Analytics()).toBeNull();
  });

  it("returns null when website ID is missing", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "");
    expect(Analytics()).toBeNull();
  });

  it("returns the Umami script element in Vercel production with a website ID", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv(
      "NEXT_PUBLIC_UMAMI_WEBSITE_ID",
      "53af9aa7-911f-4e0f-ad64-fc708e15bdb9",
    );
    const element = Analytics();
    expect(element).not.toBeNull();
    expect(element?.props).toMatchObject({
      src: "https://cloud.umami.is/script.js",
      strategy: "afterInteractive",
      "data-website-id": "53af9aa7-911f-4e0f-ad64-fc708e15bdb9",
      "data-domains": "samamokom.vercel.app",
      "data-exclude-search": "true",
    });
  });
});
