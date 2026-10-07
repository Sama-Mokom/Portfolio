"use client";
import Link from "@/components/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container empty-state">
      <span className="eyebrow">Something went wrong</span>
      <h1>That page couldn’t finish loading.</h1>
      <p>Please try again. You can also head back to the home page.</p>
      <div className="actions">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <Link className="button button-secondary" href="/">
          Back home
        </Link>
      </div>
    </div>
  );
}
