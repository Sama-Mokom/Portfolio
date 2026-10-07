import { describe, expect, it } from "vitest";
import { articles } from "@/content/articles";
import { projects } from "@/content/projects";
import {
  getArticle,
  getProject,
  readingTime,
  validateContent,
} from "@/lib/content";

describe("published content contract", () => {
  it("validates every real project and article before publishing", () => {
    expect(() => validateContent()).not.toThrow();
    expect(projects).toHaveLength(5);
    expect(articles.length).toBeGreaterThan(0);
  });

  it("resolves known entries and handles unknown routes without fabricated content", () => {
    expect(getProject("campusdesk")).toBe(
      projects.find((project) => project.slug === "campusdesk"),
    );
    expect(getProject("does-not-exist")).toBeUndefined();
    expect(getArticle(articles[0].slug)).toBe(articles[0]);
    expect(getArticle("does-not-exist")).toBeUndefined();
  });

  it("rejects duplicate project URLs", () => {
    expect(() =>
      validateContent({ projects: [projects[0], projects[0]], articles }),
    ).toThrow(/duplicate/i);
  });

  it("rejects unsafe route slugs", () => {
    const invalid = { ...projects[0], slug: "../outside" };
    expect(() =>
      validateContent({ projects: [invalid, ...projects.slice(1)], articles }),
    ).toThrow(/invalid slug/i);
  });

  it("rejects case studies missing required editorial sections", () => {
    const invalid = { ...projects[0], sections: [] };
    expect(() =>
      validateContent({ projects: [invalid, ...projects.slice(1)], articles }),
    ).toThrow(/sections/i);
  });

  it("rejects duplicate article URLs", () => {
    expect(() =>
      validateContent({ projects, articles: [articles[0], articles[0]] }),
    ).toThrow(/duplicate/i);
  });

  it("rejects empty articles rather than rendering blank pages", () => {
    const invalid = { ...articles[0], sections: [] };
    expect(() =>
      validateContent({ projects, articles: [invalid, ...articles.slice(1)] }),
    ).toThrow(/sections/i);
  });

  it("rejects impossible calendar dates", () => {
    const invalid = { ...articles[0], date: "2026-02-30" };
    expect(() =>
      validateContent({ projects, articles: [invalid, ...articles.slice(1)] }),
    ).toThrow(/invalid date/i);
  });

  it("rejects related links pointing at unpublished projects", () => {
    const invalid = { ...articles[0], relatedWork: ["does-not-exist"] };
    expect(() =>
      validateContent({ projects, articles: [invalid, ...articles.slice(1)] }),
    ).toThrow(/unknown project/i);
  });

  it("rejects repository links with executable URL schemes", () => {
    const invalid = { ...projects[0], repository: "javascript:alert(1)" };
    expect(() =>
      validateContent({ projects: [invalid, ...projects.slice(1)], articles }),
    ).toThrow(/HTTPS URL/i);
  });
});

describe("reading time", () => {
  it("reports at least one minute for a short readable note", () => {
    expect(readingTime("A brief engineering note.")).toBe(1);
  });

  it("increases for long articles and returns whole minutes", () => {
    const result = readingTime(
      Array.from({ length: 1800 }, () => "engineering").join(" "),
    );
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThan(5);
  });
});
