"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  ["Properties", "/properties"],
  ["Developers", "/developers"],
  ["Services", "/services"],
  ["Our Story", "/about"],
  ["Insights", "/blogs"],
];

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", open);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.classList.remove("nav-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className={`site-header ${overlay ? "is-overlay" : ""} ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
      <Link href="/" className="brand" aria-label="Divine Luxury Properties home">
        <span className="brand-mark" aria-hidden="true" />
        <span><strong>DIVINE</strong><small>LUXURY PROPERTIES</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className={pathname.startsWith(href) ? "active" : ""}>{label}</Link>
        ))}
      </nav>
      <Link className="header-cta" href="/contact">Contact Us <span>↗</span></Link>
      <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}>
        <span /><span />
      </button>
      <div className="mobile-menu" id="mobile-navigation" aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          <span className="mobile-menu-label">Explore Divine</span>
          <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
          {nav.map(([label, href]) => <Link key={href} href={href} className={pathname.startsWith(href) ? "active" : ""}>{label}</Link>)}
          <Link href="/careers" className={pathname.startsWith("/careers") ? "active" : ""}>Careers</Link>
        </nav>
        <div className="mobile-menu-lower">
          <Link href="/contact" className="mobile-menu-cta">Contact Us <span>↗</span></Link>
          <div className="mobile-menu-foot"><span>Dubai, UAE</span><a href="tel:+97145550188">+971 4 555 0188</a></div>
        </div>
      </div>
    </header>
  );
}
