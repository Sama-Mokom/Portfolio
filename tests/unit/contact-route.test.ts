import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

const fields = {
  name: "Ada Lovelace",
  email: "ada@example.org",
  subject: "General enquiry",
  message: "I would like to discuss a software project.",
  website: "",
};

function request(data = fields, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Origin: "http://localhost:3000",
      "Content-Type": "application/x-www-form-urlencoded",
      ...headers,
    },
    body: new URLSearchParams(data).toString(),
  });
}

beforeEach(() => {
  vi.stubEnv("CONTACT_FORM_ENDPOINT", "");
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("contact endpoint", () => {
  it("rejects cross-origin submissions before attempting delivery", async () => {
    const response = await POST(
      request(fields, { Origin: "https://unrelated.example" }),
    );
    expect(response.status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("validates fields server-side when browser validation is bypassed", async () => {
    const response = await POST(
      request({ ...fields, name: "", email: "bad", message: "" }),
    );
    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({
      ok: false,
      errors: {
        name: expect.any(String),
        email: expect.any(String),
        message: expect.any(String),
      },
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects honeypot and oversized submissions without contacting a service", async () => {
    expect(
      (await POST(request({ ...fields, website: "bot.example" }))).status,
    ).toBe(400);
    expect(
      (await POST(request(fields, { "Content-Length": "96001" }))).status,
    ).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([undefined, "1"])(
    "rejects an oversized body when Content-Length is %s",
    async (declaredLength) => {
      const payload = new URLSearchParams({
        ...fields,
        ignored: "x".repeat(96000),
      });
      const response = await POST(
        new Request("http://localhost:3000/api/contact", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Origin: "http://localhost:3000",
            "Content-Type": "application/x-www-form-urlencoded",
            ...(declaredLength ? { "Content-Length": declaredLength } : {}),
          },
          body: payload.toString(),
        }),
      );
      expect(response.status).toBe(413);
      expect(await response.json()).toMatchObject({ ok: false });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("parses a multipart browser submission after enforcing the body limit", async () => {
    const body = new FormData();
    for (const [field, value] of Object.entries(fields)) body.set(field, value);
    const response = await POST(
      new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Origin: "http://localhost:3000",
        },
        body,
      }),
    );
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      mailto: expect.stringMatching(/^mailto:/),
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns an unsent email draft when delivery is unconfigured", async () => {
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    const result = await response.json();
    expect(result.ok).toBe(false);
    const draft = new URL(result.mailto);
    expect(draft.protocol).toBe("mailto:");
    expect(draft.searchParams.get("body")).toContain(fields.message);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("accepts the browser host when Next uses a different internal hostname", async () => {
    const response = await POST(
      request(fields, {
        Host: "127.0.0.1:3000",
        Origin: "http://127.0.0.1:3000",
      }),
    );
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      mailto: expect.stringMatching(/^mailto:/),
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps native validation redirects on the browser's current host", async () => {
    const response = await POST(
      request(
        { ...fields, message: "" },
        {
          Host: "127.0.0.1:3000",
          Origin: "http://127.0.0.1:3000",
          Accept: "text/html",
        },
      ),
    );
    expect(response.status).toBe(303);
    const destination = new URL(
      response.headers.get("location")!,
      "http://127.0.0.1:3000/api/contact",
    );
    expect(destination.origin).toBe("http://127.0.0.1:3000");
    expect(destination.pathname).toBe("/contact");
    expect(destination.searchParams.get("status")).toBe("invalid");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("renders a safe draft page for native form submissions", async () => {
    const response = await POST(
      request(
        { ...fields, name: "<script>alert(1)</script>" },
        { Accept: "text/html" },
      ),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(response.headers.get("cache-control")).toBe("no-store");
    const html = await response.text();
    expect(html).toContain("This website has not sent a message.");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports configured delivery failure honestly and keeps provider errors private", async () => {
    vi.stubEnv("CONTACT_FORM_ENDPOINT", "https://formspree.io/f/abc123");
    vi.mocked(fetch).mockResolvedValue(
      new Response("private provider failure", { status: 500 }),
    );
    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://formspree.io/f/abc123",
      expect.objectContaining({ method: "POST", redirect: "error" }),
    );
  });
});
