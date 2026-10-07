import { describe, expect, it } from "vitest";
import {
  buildMailto,
  CONTACT_EMAIL,
  CONTACT_SUBJECTS,
  isContactEndpoint,
  readContactFields,
  validateContact,
  type ContactFields,
} from "@/lib/contact";

const valid: ContactFields = {
  name: "Mokom & Company",
  email: "hello+project@example.org",
  subject: CONTACT_SUBJECTS[0],
  message:
    "I would like to discuss an accessible portfolio & its API.\nThank you!",
  website: "",
};

describe("contact validation", () => {
  it("accepts a complete enquiry", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("returns actionable field errors for an empty form", () => {
    const errors = validateContact({
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    });
    for (const field of ["name", "email", "subject", "message"] as const) {
      expect(errors[field]).toEqual(expect.any(String));
      expect(errors[field]!.length).toBeGreaterThan(5);
    }
  });

  it.each([
    ["name", "A"],
    ["name", "A".repeat(101)],
    ["email", "person@"],
    ["email", "person @example.org"],
    ["subject", "An unlisted topic"],
    ["message", "Too short"],
    ["message", "A".repeat(5001)],
  ] as const)("rejects an invalid %s", (field, value) => {
    expect(validateContact({ ...valid, [field]: value })[field]).toBeTruthy();
  });

  it("normalizes form input and ignores unexpected fields", () => {
    const data = new FormData();
    data.set("name", "  Ada Lovelace  ");
    data.set("email", " ada@example.org ");
    data.set("unexpected", "never part of the message");
    expect(readContactFields(data)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.org",
      subject: "",
      message: "",
      website: "",
    });
  });
});

describe("email fallback", () => {
  it("preserves punctuation and newlines without injecting URL parameters", () => {
    const mailto = new URL(buildMailto(valid));
    expect(mailto.protocol).toBe("mailto:");
    expect(mailto.pathname).toBe(CONTACT_EMAIL);
    expect(mailto.searchParams.get("subject")).toContain(valid.subject);
    expect(mailto.searchParams.get("subject")).toContain(valid.name);
    expect(mailto.searchParams.get("body")).toContain(valid.message);
    expect(mailto.searchParams.get("body")).toContain(valid.email);
    expect([...mailto.searchParams.keys()].sort()).toEqual(["body", "subject"]);
  });
});

describe("configured contact destination", () => {
  it("accepts an HTTPS Formspree form endpoint", () => {
    expect(isContactEndpoint("https://formspree.io/f/abc123")).toBe(true);
  });

  it.each([
    undefined,
    "",
    "http://formspree.io/f/abc123",
    "https://example.org/f/abc123",
    "https://formspree.io.evil.example/f/abc123",
    "https://user:pass@formspree.io/f/abc123",
    "https://formspree.io:8443/f/abc123",
    "https://formspree.io/f/abc123?next=other",
    "https://formspree.io/f/abc123#fragment",
    "javascript:alert(1)",
  ])("rejects unapproved or malformed endpoint %s", (endpoint) => {
    expect(isContactEndpoint(endpoint)).toBe(false);
  });
});
