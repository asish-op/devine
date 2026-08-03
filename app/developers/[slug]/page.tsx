import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "../../components/PageHero";
import { SiteFooter } from "../../components/SiteFooter";
import { DeveloperPropertyGrid } from "../../components/LivePropertyGrid";
import { developers } from "../../data";

export async function generateStaticParams() { return developers.map((developer) => ({ slug: developer.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const developer = developers.find((item) => item.slug === slug); return { title: developer ? `${developer.name} Properties` : "Developer" }; }
export default async function DeveloperPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const developer = developers.find((item) => item.slug === slug); if (!developer) notFound(); return <main id="top"><PageHero eyebrow="Developer partner" title={developer.name} description={`${developer.note}. A selected view of current residences and private opportunities available through Divine.`} />
  <section className="section shell developer-profile"><div><span className="developer-monogram">{developer.name.slice(0, 2)}</span></div><div><span className="eyebrow">About {developer.name}</span><h2>A distinct point of view on modern Dubai living.</h2><p>Known for thoughtful placemaking, design quality and a strong commitment to delivery, {developer.name} has shaped some of the city’s most recognised residential addresses.</p><p>Our direct relationship provides informed guidance on available inventory, release schedules and the residences best suited to each client’s priorities.</p><Link className="text-link" href="/contact">Request private inventory <span>↗</span></Link></div></section>
  <section className="section properties-section"><div className="shell section-heading"><div><span className="eyebrow">Selected residences</span><h2>Projects by {developer.name}</h2></div></div><DeveloperPropertyGrid developerSlug={slug} /></section><SiteFooter /></main>; }
