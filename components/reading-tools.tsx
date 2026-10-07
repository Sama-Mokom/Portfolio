"use client";
import { useEffect, useRef, useState } from "react";
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="reading-progress"
      style={{ transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}
export function MobileContents({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  return (
    <details className="mobile-toc">
      <summary>On this page</summary>
      <nav aria-label="Article sections">
        {sections.map((s) => (
          <a href={`#${s.id}`} key={s.id}>
            {s.title}
          </a>
        ))}
      </nav>
    </details>
  );
}
export function TableOfContents({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-100px 0px -55% 0px" },
    );
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);
  return (
    <aside className="toc">
      <span className="eyebrow">On this page</span>
      <nav aria-label="Table of contents">
        {sections.map((s) => (
          <a
            href={`#${s.id}`}
            key={s.id}
            aria-current={active === s.id ? "location" : undefined}
          >
            {s.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
