"use client";

export function PrintButton() {
  return (
    <button
      className="button button-secondary"
      type="button"
      onClick={() => window.print()}
    >
      Print résumé <span aria-hidden="true">↗</span>
    </button>
  );
}
