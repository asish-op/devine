import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand">
          <Link href="/" className="brand footer-logo" aria-label="Divine Luxury Properties home">
            <span className="brand-mark" aria-hidden="true" />
            <span><strong>DIVINE</strong><small>LUXURY PROPERTIES</small></span>
          </Link>
          <p>Private real estate advisory for exceptional homes and considered investments in Dubai.</p>
        </div>
        <div className="footer-column"><span className="footer-label">Explore</span><Link href="/properties">Properties</Link><Link href="/developers">Developers</Link><Link href="/services">Services</Link><Link href="/blogs">Insights</Link></div>
        <div className="footer-column"><span className="footer-label">Company</span><Link href="/about">About Us</Link><Link href="/mission">Mission & Vision</Link><Link href="/careers">Careers</Link><Link href="/contact">Contact</Link></div>
        <div className="footer-column contact-column"><span className="footer-label">Private office</span><p>Boulevard Plaza<br />Downtown Dubai, UAE</p><a href="tel:+971567522114">+971 56 752 2114</a><a href="mailto:contact@dlpdxb.com">contact@dlpdxb.com</a></div>
      </div>
      <div className="footer-bottom shell"><span>© 2026 Divine Luxury Properties</span><div><a href="#">Instagram</a><a href="#">LinkedIn</a><a href="#">YouTube</a></div><Link href="#top">Back to top ↑</Link></div>
    </footer>
  );
}
