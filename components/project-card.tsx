import Link from "@/components/link";
import type { Project } from "@/content/projects";
import { ProjectArt } from "./project-art";
import { Arrow, Tags } from "./ui";
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Link href={`/work/${project.slug}`}>
        <ProjectArt slug={project.slug} />
        <div className="project-card-body">
          <h3>{project.title}</h3>
          <p>{project.tagline}</p>
          <div className="project-card-bottom">
            <Tags values={project.technologies.slice(0, 3)} />
            <Arrow />
          </div>
        </div>
      </Link>
    </article>
  );
}
