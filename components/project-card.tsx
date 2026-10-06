import Link from "@/components/link";
import type { Project } from "@/content/projects";
import { ProjectMedia } from "./project-media";
import { ProjectLinks } from "./project-links";
import { Arrow, Tags } from "./ui";
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`project-card${project.image ? " project-card--with-image" : ""}`}
    >
      <Link href={`/work/${project.slug}`}>
        <ProjectMedia
          project={project}
          className="project-card-image"
          sizes="(max-width: 640px) 100vw, (max-width: 900px) 33vw, 25vw"
          decorative
        />
        <div className="project-card-body">
          <h3>{project.title}</h3>
          <p>{project.tagline}</p>
          <div className="project-card-bottom">
            <Tags values={project.technologies.slice(0, 3)} />
            <Arrow />
          </div>
        </div>
      </Link>
      <ProjectLinks project={project} />
    </article>
  );
}
