import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { FeaturedPropertyAside, LivePropertyGrid } from "./components/LivePropertyGrid";
import { EnquiryForm } from "./components/Forms";
import { insights } from "./data";

const featuredPartnerLogos = [
  { name: "Emaar", logo: "emaar", href: "/developers/emaar" },
  { name: "Sobha Realty", logo: "sobha-realty", href: "/developers/sobha-realty" },
  { name: "Meraas", logo: "meraas", href: "/developers/meraas" },
  { name: "DAMAC", logo: "damac", href: "/developers" },
  { name: "Nakheel", logo: "nakheel", href: "/developers/nakheel" },
  { name: "Ellington Properties", logo: "ellington-properties", href: "/developers/ellington" },
];

export default function Home() {
  return (
    <main id="top">
      <SiteHeader overlay />
      <section className="home-hero">
        <div className="hero-media" />
        <div className="hero-shade" />
        <div className="hero-content shell">
          <div className="hero-main">
            <span className="eyebrow light">Divine Luxury Properties</span>
            <h1>Redefining real estate.<br /><em>Brokerage in Dubai.</em></h1>
            <p>Inventive solutions, personalised experiences and steadfast support for every property journey.</p>
            <div className="hero-actions"><Link href="/properties" className="button button-gold">Explore residences <span>↗</span></Link><Link href="/contact" className="button button-ghost">Speak with an advisor</Link></div>
          </div>
          <FeaturedPropertyAside />
        </div>
        <a href="#introduction" className="scroll-cue" aria-label="Scroll to introduction"><span>Scroll</span><i /></a>
      </section>

      <section id="introduction" className="intro-section section shell">
        <div className="section-index">01</div>
        <div className="intro-lead"><span className="eyebrow">The Divine approach</span><h2>Luxury is personal.<br />So is our advice.</h2></div>
        <div className="intro-copy"><p>Divine Luxury Properties is an independent advisory for clients who expect discernment, clarity and absolute discretion.</p><p>We go beyond listings to understand how you want to live—then open the right doors, negotiate with precision and manage every detail.</p><Link className="text-link" href="/about">Discover our story <span>↗</span></Link></div>
      </section>

      <section className="numbers-band">
        <div className="shell numbers-grid"><div><strong>15+</strong><span>Years of market insight</span></div><div><strong>AED 2.4B</strong><span>Value transacted</span></div><div><strong>30+</strong><span>Developer partners across UAE & India</span></div><div><strong>17</strong><span>Nationalities represented</span></div></div>
      </section>

      <section className="section properties-section">
        <div className="shell section-heading"><div><span className="eyebrow">Selected portfolio</span><h2>Homes of distinction</h2></div><p>A concise edit of residences chosen for architecture, position and enduring value.</p><Link className="text-link" href="/properties">View all properties <span>↗</span></Link></div>
        <LivePropertyGrid limit={3} className="home-properties shell" />
      </section>

      <section className="editorial-split">
        <div className="editorial-image"><img src="/images/interior.jpg" alt="Contemporary luxury residence interior" /></div>
        <div className="editorial-copy"><span className="eyebrow light">Why Divine</span><h2>Your interests,<br /><em>beautifully aligned.</em></h2><p>We represent you—not the transaction. Every recommendation is grounded in rigorous market intelligence and a clear understanding of your ambitions.</p><ul><li><span>01</span>Off-market access</li><li><span>02</span>Independent guidance</li><li><span>03</span>End-to-end discretion</li></ul><Link href="/services" className="button button-outline-light">Our advisory services <span>↗</span></Link></div>
      </section>

      <section className="section developer-section shell">
        <div className="section-heading"><div><span className="eyebrow">Our relationships</span><h2>Trusted by leading developers</h2></div><p>Long-standing partnerships create early access, direct intelligence and a smoother path from selection to handover.</p></div>
        <div className="developer-marquee logo-marquee">{featuredPartnerLogos.map((partner) => <Link href={partner.href} key={partner.name} aria-label={`Explore ${partner.name}`}><img src={`/images/partners/${partner.logo}.png`} alt={partner.name} loading="lazy" /></Link>)}</div>
        <div className="centered-action"><Link href="/developers" className="text-link">Meet our developer partners <span>↗</span></Link></div>
      </section>

      <section className="services-preview section">
        <div className="shell"><div className="section-heading light-heading"><div><span className="eyebrow light">Private client services</span><h2>From first thought<br />to front door.</h2></div><p>A single, experienced team for property acquisition, investment strategy and every detail in between.</p></div>
          <div className="service-list"><Link href="/services"><span>01</span><h3>Buy & Sell</h3><p>Strategic representation for buyers and sellers.</p><i>↗</i></Link><Link href="/services"><span>02</span><h3>Rent & Lease</h3><p>Confident leasing for owners and occupiers.</p><i>↗</i></Link><Link href="/services"><span>03</span><h3>Holiday Homes</h3><p>Premium short-stay positioning and operations.</p><i>↗</i></Link><Link href="/services"><span>04</span><h3>Property Management</h3><p>End-to-end care for every residence.</p><i>↗</i></Link><Link href="/services"><span>05</span><h3>Commercial Investment</h3><p>Insight-led commercial opportunities.</p><i>↗</i></Link></div>
        </div>
      </section>

      <section className="testimonial-section section shell">
        <span className="eyebrow">Client perspective</span><blockquote>“Divine understood the brief behind the brief. The process was calm, candid and impeccably handled from our first viewing to final handover.”</blockquote><div className="testimonial-author"><span>AR</span><p><strong>Private client</strong><br />London & Dubai</p></div>
      </section>

      <section className="section insights-section shell">
        <div className="section-heading"><div><span className="eyebrow">Journal</span><h2>Ideas worth knowing</h2></div><Link className="text-link" href="/blogs">View all insights <span>↗</span></Link></div>
        <div className="insights-grid">{insights.map((item) => <article key={item.title}><Link href="/blogs"><img src={item.image} alt="" /></Link><span>{item.category} · {item.date}</span><h3><Link href="/blogs">{item.title}</Link></h3><p>{item.excerpt}</p></article>)}</div>
      </section>

      <section className="contact-band"><div className="shell contact-band-grid"><div><span className="eyebrow light">A considered next step</span><h2>Let’s find the place<br />that feels inevitable.</h2><p>Tell us what you have in mind. The first conversation is private, unhurried and without obligation.</p></div><EnquiryForm compact source="Home page" /></div></section>
      <SiteFooter />
      <a className="whatsapp-fab" href="https://wa.me/971567522114" target="_blank" rel="noreferrer" aria-label="Chat with Divine Luxury Properties on WhatsApp"><span>◔</span><em>WhatsApp</em></a>
    </main>
  );
}
