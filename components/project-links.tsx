import type { Project } from "@/content/projects";

export function ProjectLinks({
  project,
  className,
  from = "project-page",
}: {
  project: Pick<Project, "slug" | "repository" | "live">;
  className?: string;
  from?: "project-page" | "work-index";
}) {
  if (!project.repository && !project.live) return null;

  return (
    <div className={["project-links", className].filter(Boolean).join(" ")}>
      {project.repository && (
        <a
          href={project.repository}
          target="_blank"
          rel="noreferrer"
          data-umami-event="outbound-click"
          data-umami-event-project={project.slug}
          data-umami-event-kind="github"
          data-umami-event-from={from}
        >
          View code <span aria-hidden="true">↗</span>
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          data-umami-event="outbound-click"
          data-umami-event-project={project.slug}
          data-umami-event-kind="live"
          data-umami-event-from={from}
        >
          Visit live site <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
