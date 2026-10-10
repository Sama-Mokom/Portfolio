import Image from "next/image";
import Link from "@/components/link";
import type { Project } from "@/content/projects";
import { ProjectLinks } from "./project-links";
import { Arrow, Tags } from "./ui";
export function ProjectCard({
  project,
  priority = false,
  headingLevel = "h3",
}: {
  project: Project;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <article className="project-card">
      <Link className="project-card-link" href={`/work/${project.slug}`}>
        <div className="project-card-image">
          <Image
            src={project.thumbnail}
            alt={project.thumbnailAlt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        </div>
        <div className="project-card-body">
          <Heading>{project.title}</Heading>
          <p>{project.cardDescription}</p>
          <div className="project-card-bottom">
            <Tags values={project.technologies.slice(0, 3)} />
            <Arrow />
          </div>
        </div>
      </Link>
      <ProjectLinks project={project} className="project-card-links" />
    </article>
  );
}
