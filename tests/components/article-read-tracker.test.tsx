import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ArticleReadTracker } from "@/components/article-read-tracker";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

describe("ArticleReadTracker", () => {
  let callbacks: ObserverCallback[] = [];
  let disconnected = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    callbacks = [];
    disconnected = 0;
    class MockIntersectionObserver {
      private cb: ObserverCallback;
      constructor(cb: ObserverCallback) {
        this.cb = cb;
        callbacks.push(cb);
      }
      observe() {}
      disconnect() {
        disconnected += 1;
      }
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    delete window.umami;
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function triggerIntersection(isIntersecting = true) {
    for (const cb of callbacks) {
      cb([{ isIntersecting }]);
    }
  }

  it("does not fire before 30 seconds even if the end is reached", () => {
    const spy = vi.fn();
    window.umami = { track: spy };
    render(
      <div>
        <aside className="author-note">End</aside>
        <ArticleReadTracker slug="when-a-gateway-lacks-idempotency" />
      </div>,
    );

    triggerIntersection(true);
    vi.advanceTimersByTime(29_999);
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not fire after 30 seconds if the end was never reached", () => {
    const spy = vi.fn();
    window.umami = { track: spy };
    render(
      <div>
        <aside className="author-note">End</aside>
        <ArticleReadTracker slug="when-a-gateway-lacks-idempotency" />
      </div>,
    );

    vi.advanceTimersByTime(60_000);
    triggerIntersection(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("fires exactly once when both 30 seconds and end intersection occur", () => {
    const spy = vi.fn();
    window.umami = { track: spy };
    const { unmount } = render(
      <div>
        <aside className="author-note">End</aside>
        <ArticleReadTracker slug="when-a-gateway-lacks-idempotency" />
      </div>,
    );

    triggerIntersection(true);
    vi.advanceTimersByTime(30_000);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("article-read", {
      slug: "when-a-gateway-lacks-idempotency",
    });

    // Repeated intersections or time should not re-fire.
    triggerIntersection(true);
    vi.advanceTimersByTime(30_000);
    expect(spy).toHaveBeenCalledTimes(1);

    unmount();
    expect(disconnected).toBe(1);
  });

  it("fires when 30 seconds elapse first and the end is scrolled into view later", () => {
    const spy = vi.fn();
    window.umami = { track: spy };
    render(
      <div>
        <aside className="author-note">End</aside>
        <ArticleReadTracker slug="a-claim-is-more-than-a-check" />
      </div>,
    );

    vi.advanceTimersByTime(30_000);
    expect(spy).not.toHaveBeenCalled();

    triggerIntersection(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("article-read", {
      slug: "a-claim-is-more-than-a-check",
    });
  });
});
