import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { developers, indiaPartners, properties, uaePartners } from "../data";

export const metadata: Metadata = { title: "Developer Partners" };

const logoOverrides: Record<string, string> = {
  "Nikhila Constructions and Developers": "nikhila-constructions",
  "Tranquillo Projects and Holdings Pvt Ltd": "tranquillo",
  "Larsen & Toubro": "larsen-toubro",
};

const logoFile = (partner: string) => logoOverrides[partner] || partner.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function DevelopersPage() {
  return <main id="top">
    <PageHero eyebrow="Developer partners" title="Relationships that open the right doors." description="An established network across the United Arab Emirates and India, connecting clients with respected developers and carefully selected opportunities." />
    <section className="section shell developer-intro"><div><span className="eyebrow">A trusted network</span><h2>Access is valuable.<br />Judgment is essential.</h2></div><p>Our developer relationships are long-standing, but our advice remains independent. We assess every opportunity on design, delivery, location and long-term value before it reaches a client shortlist.</p></section>

    <section className="partner-regions section"><div className="shell">
      <div className="partner-region"><div className="partner-region-head"><span className="eyebrow light">Our partners</span><h2>United Arab Emirates</h2><strong>{String(uaePartners.length).padStart(2, "0")}</strong></div><div className="partner-cloud">{uaePartners.map((partner) => <span key={partner}><img src={`/images/partners/${logoFile(partner)}.png`} alt={partner} loading="lazy" /></span>)}</div><p className="partner-more">And more</p></div>
      <div className="partner-region"><div className="partner-region-head"><span className="eyebrow light">Our partners</span><h2>India</h2><strong>{String(indiaPartners.length).padStart(2, "0")}</strong></div><div className="partner-cloud">{indiaPartners.map((partner) => <span key={partner}><img src={`/images/partners/${logoFile(partner)}.png`} alt={partner} loading="lazy" /></span>)}</div><p className="partner-more">And more</p></div>
    </div></section>

    <section className="section featured-partners"><div className="shell"><div className="section-heading"><div><span className="eyebrow">Featured relationships</span><h2>Explore selected partners.</h2></div><p>Discover profiles and current opportunities from a selection of our established developer relationships.</p></div><div className="developer-directory">{developers.map((developer, index) => { const count = properties.filter((property) => property.developerSlug === developer.slug).length; return <Link href={`/developers/${developer.slug}`} key={developer.slug}><span>{String(index + 1).padStart(2, "0")}</span><strong>{developer.name}</strong><p>{developer.note}</p><em>{count || "Private"} {count === 1 ? "project" : "opportunities"}</em><i>↗</i></Link>; })}</div></div></section>

    <section className="section shell partner-note"><div className="partner-note-image"><img src="/images/project-four.jpg" alt="Modern luxury villa" /></div><div><span className="eyebrow">Our selection standard</span><h2>We look beyond the launch.</h2><p>Architecture, delivery record, service quality, community planning and resale depth all matter. Our clients receive the full context - not only the brochure.</p><ul><li>Developer track record</li><li>Construction & specification review</li><li>Comparable market analysis</li><li>Exit and rental scenario modelling</li></ul></div></section>
    <SiteFooter />
  </main>;
}
