import { articles, type Article } from "../content/articles";
import {
  projects,
  type ContentSection,
  type Project,
} from "../content/projects";

export { articles, projects };
export type { Article, Project, ContentSection };

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter((article) => article.tags.includes(tag.toLowerCase()));
}

export const allTags = [
  ...new Set(articles.flatMap((article) => article.tags)),
].sort();

/** Whole minutes at the blueprint's 200-word prose reading rate. */
export function readingTime(text: string): number {
  const words = text.trim().match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function articleReadingTime(article: Article): number {
  const prose = [
    article.summary,
    ...article.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
    ]),
  ].join(" ");
  const proseWords = prose.trim().match(/\S+/g)?.length ?? 0;
  const codeWords = article.code?.value.trim().match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil((proseWords + codeWords / 2) / 200));
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const requiredProjectSections = [
  "context",
  "problem",
  "users",
  "constraints",
  "my-role",
  "architecture",
  "engineering-deep-dive",
  "hard-problem",
  "visual-evidence",
  "outcome",
  "current-state",
  "retrospective",
];

function fail(message: string): never {
  throw new Error(`Invalid portfolio content: ${message}`);
}

function assertText(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0)
    fail(`${name} must be non-empty text`);
}

function assertTextArray(
  value: unknown,
  name: string,
  allowEmpty = false,
): asserts value is string[] {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0))
    fail(
      `${name} must be an array${allowEmpty ? "" : " with at least one item"}`,
    );
  for (const item of value) assertText(item, name);
}

function assertSections(
  sections: unknown,
  name: string,
): asserts sections is ContentSection[] {
  if (!Array.isArray(sections) || sections.length === 0)
    fail(`${name} needs sections`);
  const ids = new Set<string>();
  for (const raw of sections) {
    if (!raw || typeof raw !== "object")
      fail(`${name} has a malformed section`);
    const section = raw as Partial<ContentSection>;
    assertText(section.id, `${name} section id`);
    if (!slugPattern.test(section.id))
      fail(`${name} has an invalid section id`);
    if (ids.has(section.id))
      fail(`${name} has duplicate section id ${section.id}`);
    ids.add(section.id);
    assertText(section.title, `${name} section title`);
    assertTextArray(section.paragraphs, `${name}/${section.id} paragraphs`);
  }
}

function assertPublicLink(value: unknown, name: string): void {
  if (value === null) return;
  assertText(value, name);
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password)
      fail(`${name} must be a public HTTPS URL`);
  } catch {
    fail(`${name} must be a public HTTPS URL or null`);
  }
}

function assertSlug(
  slug: unknown,
  used: Set<string>,
  name: string,
): asserts slug is string {
  assertText(slug, `${name} slug`);
  if (!slugPattern.test(slug)) fail(`${name} has an invalid slug`);
  if (used.has(slug)) fail(`${name} has duplicate slug ${slug}`);
  used.add(slug);
}

/** Runtime validation supplements strict TypeScript and runs during content loading.
 * Tests can pass complete alternate collections to verify malformed content rejection.
 */
export function validateContent(
  input: { projects?: readonly Project[]; articles?: readonly Article[] } = {},
): void {
  const projectCollection = input.projects ?? projects;
  const articleCollection = input.articles ?? articles;
  if (!Array.isArray(projectCollection) || projectCollection.length === 0)
    fail("projects must be a non-empty array");
  if (!Array.isArray(articleCollection)) fail("articles must be an array");
  const projectSlugs = new Set<string>();
  const articleSlugs = new Set<string>();

  for (const project of projectCollection) {
    if (!project || typeof project !== "object") fail("malformed project");
    assertSlug(project.slug, projectSlugs, "project");
    for (const key of [
      "title",
      "tagline",
      "summary",
      "role",
      "year",
      "timeframe",
      "status",
    ] as const) {
      assertText(project[key], `${project.slug} ${key}`);
    }
    if (typeof project.featured !== "boolean")
      fail(`${project.slug} featured must be boolean`);
    assertTextArray(project.technologies, `${project.slug} technologies`);
    assertPublicLink(project.repository, `${project.slug} repository`);
    assertPublicLink(project.live, `${project.slug} live`);
    assertSections(project.sections, project.slug);
    for (const id of requiredProjectSections) {
      if (
        !project.sections.some((section: ContentSection) => section.id === id)
      )
        fail(`${project.slug} missing required section ${id}`);
    }
    if (!project.architecture || typeof project.architecture !== "object")
      fail(`${project.slug} needs architecture`);
    assertTextArray(
      project.architecture.nodes,
      `${project.slug} architecture nodes`,
    );
    assertText(
      project.architecture.description,
      `${project.slug} architecture description`,
    );
    if (!Array.isArray(project.decisions) || project.decisions.length < 2)
      fail(`${project.slug} needs at least two decisions`);
    for (const decision of project.decisions) {
      if (!decision || typeof decision !== "object")
        fail(`${project.slug} has a malformed decision`);
      for (const key of ["title", "choice", "rejected", "cost"] as const)
        assertText(decision[key], `${project.slug} decision ${key}`);
    }
    assertTextArray(
      project.relatedWriting,
      `${project.slug} related writing`,
      true,
    );
  }

  for (const article of articleCollection) {
    if (!article || typeof article !== "object") fail("malformed article");
    assertSlug(article.slug, articleSlugs, "article");
    assertText(article.title, `${article.slug} title`);
    assertText(article.summary, `${article.slug} summary`);
    assertText(article.date, `${article.slug} date`);
    const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(article.date)
      ? new Date(`${article.date}T00:00:00Z`)
      : null;
    if (
      !dateValue ||
      Number.isNaN(dateValue.getTime()) ||
      dateValue.toISOString().slice(0, 10) !== article.date
    )
      fail(`${article.slug} has an invalid date`);
    assertTextArray(article.tags, `${article.slug} tags`);
    if (article.tags.some((tag: string) => !slugPattern.test(tag)))
      fail(`${article.slug} tags must be lowercase slugs`);
    if (new Set(article.tags).size !== article.tags.length)
      fail(`${article.slug} has duplicate tags`);
    assertSections(article.sections, article.slug);
    assertTextArray(article.relatedWork, `${article.slug} related work`, true);
    assertTextArray(
      article.relatedPosts,
      `${article.slug} related posts`,
      true,
    );
    if (article.code !== undefined) {
      if (!article.code || typeof article.code !== "object")
        fail(`${article.slug} has malformed code`);
      assertText(article.code.label, `${article.slug} code label`);
      assertText(article.code.language, `${article.slug} code language`);
      assertText(article.code.value, `${article.slug} code value`);
    }
  }

  for (const project of projectCollection) {
    for (const slug of project.relatedWriting) {
      if (!articleSlugs.has(slug))
        fail(`${project.slug} references unknown article ${slug}`);
    }
  }
  for (const article of articleCollection) {
    for (const slug of article.relatedWork) {
      if (!projectSlugs.has(slug))
        fail(`${article.slug} references unknown project ${slug}`);
    }
    for (const slug of article.relatedPosts) {
      if (!articleSlugs.has(slug) || slug === article.slug)
        fail(`${article.slug} references invalid related article ${slug}`);
    }
  }
}

validateContent();
