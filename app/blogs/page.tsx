import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { insights } from "../data";

export const metadata: Metadata = { title: "Insights", description: "Perspectives on Dubai luxury property, design and investment." };
export default function BlogsPage() { return <main id="top"><PageHero eyebrow="The Divine journal" title="Perspective beyond the property." description="Measured views on architecture, neighbourhoods and the forces shaping Dubai’s most important homes." />
  <section className="featured-insight shell"><img src={insights[0].image} alt="Modern Dubai residence" /><div><span className="eyebrow">{insights[0].category} · {insights[0].date}</span><h2>{insights[0].title}</h2><p>{insights[0].excerpt}</p><button className="text-link">Read the perspective <span>↗</span></button></div></section>
  <section className="section shell insights-archive"><div className="archive-head"><h2>Latest thinking</h2><div><button className="active">All</button><button>Market</button><button>Design</button><button>Neighbourhoods</button></div></div><div className="insights-grid">{[...insights, ...insights].slice(1, 6).map((item, index) => <article key={`${item.title}-${index}`}><img src={item.image} alt="" /><span>{item.category} · {item.date}</span><h3>{item.title}</h3><p>{item.excerpt}</p><button className="text-link">Read more <span>↗</span></button></article>)}</div></section>
  <section className="newsletter-band"><div className="shell"><div><span className="eyebrow light">Private notes</span><h2>Occasional insight,<br />never noise.</h2></div><form><label><span className="sr-only">Email address</span><input type="email" required placeholder="Your email address" /></label><button type="submit">Subscribe ↗</button></form></div></section><SiteFooter /></main>; }
