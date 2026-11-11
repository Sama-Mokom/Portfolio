export type AnalyticsEventMap = {
  "article-read": { slug: string };
  "cv-download": undefined;
  "outbound-click": {
    project: string;
    kind: "github" | "live";
    from: "project-page" | "work-index";
  };
  "social-click": {
    target: "github" | "linkedin" | "email";
  };
  "contact-submit": {
    result: "sent" | "mailto" | "failed";
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

declare global {
  interface Window {
    umami?: {
      track: (
        event: string,
        data?: Record<string, string | number | boolean>,
      ) => void;
    };
  }
}

export function track<K extends AnalyticsEventName>(
  event: K,
  ...args: AnalyticsEventMap[K] extends undefined
    ? []
    : [props: AnalyticsEventMap[K]]
): void {
  if (typeof window === "undefined") return;
  const tracker = window.umami?.track;
  if (typeof tracker !== "function") return;
  try {
    const props = args[0];
    if (props === undefined) {
      tracker(event);
    } else {
      tracker(event, props);
    }
  } catch {
    // Never let analytics break user flows.
  }
}
