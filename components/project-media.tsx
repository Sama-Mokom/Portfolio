import Image from "next/image";
import type { Project } from "@/content/projects";

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
  return (
    <div className={`project-media ${className}`}>
      <Image
        src={project.thumbnail}
        alt={decorative ? "" : project.thumbnailAlt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
