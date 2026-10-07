import Image from "next/image";
import type { Project } from "@/content/projects";
import { ProjectArt } from "./project-art";

export function ProjectMedia({
  project,
  className,
  sizes,
  priority = false,
  decorative = false,
}: {
  project: Project;
  className: string;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  if (!project.image) {
    return <ProjectArt slug={project.slug} />;
  }

  return (
    <div className={`project-media ${className}`}>
      <Image
        src={project.image}
        alt={decorative ? "" : `${project.title} project preview`}
        fill
        priority={priority}
        sizes={sizes}
        style={{
          objectFit: "cover",
          objectPosition: project.imagePosition ?? "center",
        }}
      />
    </div>
  );
}
