import Link from "@/components/link";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="wordmark" href="/">
              MOKOM
            </Link>
            <p>
              Thoughtful software.
              <br />
              Real problems. Always learning.
            </p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {[
              ["/work", "Work"],
              ["/about", "About"],
              ["/writing", "Writing"],
              ["/lab", "Lab"],
              ["/now", "Now"],
              ["/contact", "Contact"],
              ["/resume", "Résumé"],
            ].map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <nav className="footer-nav" aria-label="Elsewhere">
            <a href="https://github.com/Sama-Mokom">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/sama-mokom-784161283">
              LinkedIn ↗
            </a>
            <a href="mailto:yungkaparaz@gmail.com">Email ↗</a>
            <Link href="/rss.xml" prefetch={false}>
              RSS feed
            </Link>
          </nav>
          <div className="footer-colophon">
            <span className="eyebrow">Made in Cameroon</span>
            <p>
              Buea · WAT / UTC+1
              <br />
              Built with Next.js & TypeScript.
              <br />
              Updated 21 September 2026.
            </p>
            <Link className="text-link" href="/about#accessibility">
              Accessibility
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Nkeng Sama Mokom</span>
          <span>Understanding before output.</span>
        </div>
      </div>
    </footer>
  );
}
