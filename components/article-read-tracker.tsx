"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const MIN_READ_MS = 30_000;

export function ArticleReadTracker({
  slug,
  targetSelector = ".author-note",
}: {
  slug: string;
  targetSelector?: string;
}) {
  useEffect(() => {
    let timeElapsed = false;
    let endReached = false;
    let fired = false;

    const tryFire = () => {
      if (fired || !timeElapsed || !endReached) return;
      fired = true;
      track("article-read", { slug });
    };

    const timer = window.setTimeout(() => {
      timeElapsed = true;
      tryFire();
    }, MIN_READ_MS);

    let observer: IntersectionObserver | undefined;
    const target = document.querySelector(targetSelector);
    if (target && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          endReached = true;
          tryFire();
        }
      });
      observer.observe(target);
    }

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [slug, targetSelector]);

  return null;
}
