import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = { title: "Our Services", description: "Buy, sell, rent, lease, holiday homes, property management and commercial investment services." };

const services = [
  ["01", "Buy & Sell", "Representation built around your outcome.", "From a private search to a carefully positioned sale, we combine market reach, direct developer access and experienced negotiation to move with confidence.", ["Buyer representation", "Property marketing", "Private viewings", "Offer strategy & negotiation"]],
  ["02", "Rent & Lease", "Leasing made precise and effortless.", "We advise landlords and occupiers with clear pricing, qualified introductions and composed management from first viewing to signed agreement.", ["Rental valuation", "Tenant qualification", "Lease negotiation", "Renewal support"]],
  ["03", "Holiday Homes", "Exceptional stays, thoughtfully managed.", "We position and operate premium short-stay homes with exacting presentation, guest care and performance oversight.", ["Listing presentation", "Guest management", "Pricing strategy", "Property readiness"]],
  ["04", "Property Management", "Care that protects long-term value.", "Our property management service keeps every residence maintained, documented and ready, whether it is occupied, leased or held for the future.", ["Preventive maintenance", "Handover & snagging", "Owner reporting", "Ongoing property care"]],
  ["05", "Commercial Investment", "Evidence-led commercial opportunity.", "We assess commercial property through fundamentals including location, demand, income resilience, operator quality and long-term exit potential.", ["Investment strategy", "Acquisition modelling", "Due diligence", "Portfolio reviews"]],
];

export default function ServicesPage() {
  return <main id="top">
    <PageHero eyebrow="Value-added services" title="Our growth engine." description="Buy and sell, rent and lease, holiday homes, property management and commercial investment - one accountable team throughout." image="/images/interior.jpg" />
    <section className="section shell services-detail">{services.map(([number, title, subtitle, copy, bullets]) => <article key={String(title)}><div className="service-number">{number}</div><div><span className="eyebrow">{title}</span><h2>{subtitle}</h2></div><div><p>{copy}</p><ul>{(bullets as string[]).map((bullet) => <li key={bullet}>{bullet}<span>↗</span></li>)}</ul></div></article>)}</section>
    <section className="process-band section"><div className="shell"><div className="section-heading light-heading"><div><span className="eyebrow light">The process</span><h2>Measured, transparent,<br />entirely personal.</h2></div></div><div className="process-grid"><article><span>01</span><h3>Private brief</h3><p>We listen closely, understand priorities and define what right truly means.</p></article><article><span>02</span><h3>Curated search</h3><p>We assess the entire market and present only the opportunities that merit your time.</p></article><article><span>03</span><h3>Informed decision</h3><p>Clear context, rigorous due diligence and experienced negotiation.</p></article><article><span>04</span><h3>Effortless completion</h3><p>One point of contact coordinating every detail through handover and aftercare.</p></article></div></div></section>
    <section className="simple-cta shell section"><span className="eyebrow">Private consultation</span><h2>Tell us where you want<br />to go next.</h2><Link className="button button-dark" href="/contact">Speak with an advisor <span>↗</span></Link></section>
    <SiteFooter />
  </main>;
}
