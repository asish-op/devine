import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = { title: "Mission, Vision & Values" };

const values = [
  ["01", "Knowledgeable", "We're the real estate wizards, turning property puzzles into solutions."],
  ["02", "Effective", "We don't just talk homes; we make them happen, lightning-fast and hassle-free."],
  ["03", "Connected", "Like GPS for homes, we navigate your journey with a world of connections."],
  ["04", "Upstanding", "Integrity is our compass, pointing us to the right path for you."],
  ["05", "Passionate", "With hearts set on \"sold\", we sprinkle passion into every deal we make."],
  ["06", "Playful", "Real estate adventure? We're the guides who turn it into a playful treasure hunt."],
];

export default function MissionPage() {
  return <main id="top">
    <PageHero eyebrow="Mission, vision & values" title="Every property holds the promise of a better life." description="We craft dreams, curate lifestyles and connect beyond borders." />
    <section className="section shell mission-grid">
      <article><span className="eyebrow">Our mission</span><h2>Spaces made for cherished memories.</h2><p>At Divine Luxury Properties, we envision a world where every space becomes a canvas for cherished memories, and every property holds the promise of a better life.</p></article>
      <article><span className="eyebrow">Our vision</span><h2>More than a brokerage.</h2><p>We are not just a brokerage. We craft dreams, curate lifestyles, and connect beyond borders. We offer inventive solutions, personalised experiences, and steadfast support, guiding clients to unmatched real estate success.</p></article>
    </section>
    <section className="manifesto-band"><div className="shell"><span className="eyebrow light">Our promise</span><p>We will never hurry a decision, promote what we would not stand behind, or let the transaction become more important than the person.</p></div></section>
    <section className="section shell values-section"><div className="section-heading"><div><span className="eyebrow">Our values</span><h2>Six qualities.<br />One Divine standard.</h2></div></div><div className="profile-values-grid">{values.map(([number, title, copy]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="simple-cta shell section"><h2>Shared values make<br />the best partnerships.</h2><Link className="button button-dark" href="/contact">Start a conversation <span>↗</span></Link></section>
    <SiteFooter />
  </main>;
}
