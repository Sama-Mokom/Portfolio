import Link from "@/components/link";
export default function NotFound() {
  return (
    <div className="container empty-state">
      <span className="eyebrow">404 / A missing page</span>
      <h1>This path doesn’t lead anywhere.</h1>
      <p>
        The page may have moved, or the address may be incomplete. The work is
        still here.
      </p>
      <div className="actions">
        <Link className="button" href="/">
          Back home
        </Link>
        <Link className="button button-secondary" href="/work">
          Explore the work
        </Link>
      </div>
    </div>
  );
}
