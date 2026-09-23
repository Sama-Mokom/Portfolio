"use client";
import Link from "@/components/link";
import { usePathname } from "next/navigation";
import { useRef, useSyncExternalStore } from "react";
import { Arrow } from "./ui";
const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/work", "Work"],
  ["/writing", "Writing"],
  ["/lab", "Lab"],
  ["/now", "Now"],
  ["/contact", "Contact"],
];
function subscribeTheme(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const systemTheme = () => (mq.matches ? "dark" : "light");
  const storedTheme = () => {
    try {
      const value = localStorage.getItem("theme");
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== "theme" || event.storageArea !== localStorage) return;
    document.documentElement.dataset.theme =
      event.newValue === "light" || event.newValue === "dark"
        ? event.newValue
        : systemTheme();
    callback();
  };
  const syncSystem = () => {
    if (storedTheme()) return;
    document.documentElement.dataset.theme = systemTheme();
    callback();
  };
  window.addEventListener("themechange", callback);
  window.addEventListener("storage", syncStorage);
  mq.addEventListener("change", syncSystem);
  return () => {
    window.removeEventListener("themechange", callback);
    window.removeEventListener("storage", syncStorage);
    mq.removeEventListener("change", syncSystem);
  };
}
function getTheme() {
  return (
    document.documentElement.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light")
  );
}
export function SiteHeader() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "light");
  function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  }
  function closeMenu() {
    dialog.current?.close();
    document.body.style.overflow = "";
    trigger.current?.focus();
  }
  const nav = links.map(([href, label]) => (
    <Link
      key={href}
      href={href}
      aria-current={
        (href === "/" ? pathname === "/" : pathname.startsWith(href))
          ? "page"
          : undefined
      }
      onClick={() => {
        if (dialog.current?.open) closeMenu();
      }}
    >
      {label}
    </Link>
  ));
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="wordmark" aria-label="Mokom — home">
          MOKOM
        </Link>
        <nav className="desktop-nav" aria-label="Primary">
          {nav}
        </nav>
        <div className="header-actions">
          <Link href="/resume" className="button header-resume">
            Résumé <Arrow />
          </Link>
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {theme === "dark" ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
                </>
              ) : (
                <path d="M20 14.2A8.6 8.6 0 0 1 9.8 4 8.6 8.6 0 1 0 20 14.2Z" />
              )}
            </svg>
          </button>
          <button
            ref={trigger}
            className="icon-button menu-trigger"
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
            aria-controls="mobile-navigation"
            onClick={() => {
              dialog.current?.showModal();
              document.body.style.overflow = "hidden";
            }}
          >
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
      <dialog
        id="mobile-navigation"
        ref={dialog}
        className="mobile-dialog"
        aria-label="Navigation menu"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const targets = dialog.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex="0"]',
          );
          if (!targets?.length) return;
          const first = targets[0];
          const last = targets[targets.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onCancel={closeMenu}
        onClose={() => {
          document.body.style.overflow = "";
        }}
      >
        <div className="dialog-header">
          <span className="wordmark">MOKOM</span>
          <button
            className="icon-button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
          >
            ✕
          </button>
        </div>
        <nav aria-label="Mobile">
          {nav}
          <Link href="/resume" onClick={closeMenu}>
            Résumé
          </Link>
        </nav>
        <p className="dialog-note">
          Building from Cameroon.
          <br />
          Open to thoughtful conversations.
        </p>
      </dialog>
      <noscript>
        <nav className="container" aria-label="Navigation without JavaScript">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{ display: "inline-block", padding: ".5rem" }}
            >
              {label}
            </a>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
