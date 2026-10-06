import type { Project } from "@/content/projects";

export function ProjectLinks({
  project,
  className,
}: {
  project: Pick<Project, "repository" | "live">;
  className?: string;
}) {
  if (!project.repository && !project.live) return null;

  return (
    <div className={["project-links", className].filter(Boolean).join(" ")}>
      {project.repository && (
        <a href={project.repository} target="_blank" rel="noreferrer">
          View code <span aria-hidden="true">↗</span>
        </a>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer">
          Visit live site <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
