import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { PropertyExplorer } from "../components/LivePropertyGrid";
import { properties } from "../data";

export const metadata: Metadata = { title: "Luxury Properties", description: "Explore a curated selection of luxury villas, penthouses and residences in Dubai." };
export default function PropertiesPage() { return <main id="top"><PageHero eyebrow="Selected portfolio" title="Exceptional homes, carefully considered." description="A curated collection chosen for design integrity, distinguished locations and enduring value." image="/images/project-four.jpg" />
  <PropertyExplorer fallback={properties} />
  <section className="offmarket-band"><div className="shell"><span className="eyebrow light">Beyond the public market</span><h2>Some of our best opportunities<br />are never listed.</h2><p>Share your brief to receive a private, highly curated selection.</p><a className="button button-gold" href="/contact">Access private inventory <span>↗</span></a></div></section><SiteFooter /></main>; }
