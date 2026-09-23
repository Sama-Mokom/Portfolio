"use client";

import { useEffect, useState } from "react";

const sections = [
  ["journey", "My journey"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["skills", "Skills"],
  ["beyond", "Interests"],
  ["values", "Values"],
] as const;

export function SectionIndex() {
  const [active, setActive] = useState<string>("journey");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    for (const [id] of sections) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="about-section-index" aria-label="About sections">
      {sections.map(([id, label]) => (
        <a
          href={`#${id}`}
          key={id}
          aria-current={active === id ? "location" : undefined}
          onClick={() => setActive(id)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
