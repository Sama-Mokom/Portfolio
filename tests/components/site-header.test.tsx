import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";

describe("site navigation", () => {
  it("identifies the current page and exposes the main destinations", () => {
    render(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(
      within(navigation).getByRole("link", { name: "Home" }),
    ).toHaveAttribute("aria-current", "page");
    for (const name of ["About", "Work", "Writing", "Lab", "Now", "Contact"]) {
      expect(within(navigation).getByRole("link", { name })).toHaveAttribute(
        "href",
        `/${name.toLowerCase()}`,
      );
    }
  });

  it("changes the theme and remembers the explicit choice", () => {
    document.documentElement.dataset.theme = "light";
    render(<SiteHeader />);
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("syncs a theme choice from another tab and follows the system when cleared", () => {
    document.documentElement.dataset.theme = "light";
    render(<SiteHeader />);
    localStorage.setItem("theme", "dark");
    fireEvent(
      window,
      new StorageEvent("storage", {
        key: "theme",
        newValue: "dark",
        storageArea: localStorage,
      }),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toBeVisible();

    localStorage.removeItem("theme");
    fireEvent(
      window,
      new StorageEvent("storage", {
        key: "theme",
        newValue: null,
        storageArea: localStorage,
      }),
    );
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("opens and closes the mobile dialog and restores trigger focus", () => {
    render(<SiteHeader />);
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Navigation menu" });
    expect(dialog).toHaveAttribute("open");
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Close navigation menu" }),
    );
    expect(dialog).not.toHaveAttribute("open");
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("handles native cancellation and releases the scroll lock", () => {
    render(<SiteHeader />);
    fireEvent.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    const dialog = screen.getByRole("dialog", { name: "Navigation menu" });
    fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
    expect(dialog).not.toHaveAttribute("open");
    expect(document.body.style.overflow).toBe("");
  });
});
