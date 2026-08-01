"use client";

import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { EnquiryForm } from "../../components/Forms";
import { PropertyCard } from "../../components/PropertyCard";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { properties, type Property } from "../../data";
import { db } from "../../lib/firebase";

export function PropertyDetailClient({ slug, fallback }: { slug: string; fallback: Property | null }) {
  const [property, setProperty] = useState<Property | null>(fallback);
  const [loading, setLoading] = useState(Boolean(db && !fallback));
  useEffect(() => {
    if (!db) return;
    return onSnapshot(doc(db, "properties", slug), (snapshot) => {
      if (snapshot.exists()) setProperty({ ...(snapshot.data() as Property), slug: (snapshot.data() as Property).slug || snapshot.id });
      setLoading(false);
    }, () => setLoading(false));
  }, [slug]);
  if (loading) return <div className="property-loading"><div className="admin-spinner" /><span>Preparing residence</span></div>;
  if (!property) return <main id="top"><SiteHeader /><section className="missing-property"><span className="eyebrow">Private collection</span><h1>This residence is no longer publicly available.</h1><p>Our advisors may know of a comparable private opportunity.</p><Link href="/contact" className="button button-dark">Speak with an advisor <span>↗</span></Link></section><SiteFooter /></main>;
  const gallery = property.gallery?.length ? property.gallery : [property.image, property.image, property.image];
  const related = properties.filter((item) => item.slug !== slug).slice(0, 2);
  return <main id="top"><SiteHeader overlay />
    <section className="property-hero" style={{ backgroundImage: `linear-gradient(0deg, rgba(5,5,4,.7), rgba(5,5,4,.08)), url(${property.image})` }}><div className="property-hero-rail"><span>DIVINE COLLECTION</span><i /><span>{property.location}</span></div><div className="shell property-hero-copy"><span className="eyebrow light">{property.developer} · {property.type}</span><h1>{property.name}</h1><div><p>{property.location}</p><strong>From {property.price}</strong></div></div></section>
    <section className="property-facts"><div className="shell"><span><small>Configuration</small>{property.bedrooms}</span><span><small>Residence size</small>{property.area}</span><span><small>Completion</small>{property.completion}</span><span><small>Developer</small><Link href={`/developers/${property.developerSlug}`}>{property.developer} ↗</Link></span><a className="button button-dark" href="/brochures/divine-celeste-brochure.pdf" download>Download brochure <span>↓</span></a></div></section>
    <section className="section shell property-overview"><div><span className="eyebrow">The residence</span><h2>Architecture in service of a remarkable life.</h2></div><div><p className="large-copy">{property.description}</p><p>Thoughtful orientation, generous proportions and a restrained material palette create spaces that feel composed in every season. Private outdoor rooms extend daily life into the landscape.</p><a href="#enquire" className="text-link">Request a private viewing <span>↗</span></a></div></section>
    <section className="property-gallery shell"><div><img src={gallery[0] || property.image} alt={`${property.name} exterior`} /></div><div><img src={gallery[1] || property.image} alt={`${property.name} living area`} /><img src={gallery[2] || property.image} alt={`${property.name} interior detail`} /></div></section>
    <section className="section shell amenities-section"><div><span className="eyebrow">Amenities</span><h2>Every detail,<br />already considered.</h2></div><ul>{property.amenities.map((amenity, index) => <li key={amenity}><span>{String(index + 1).padStart(2, "0")}</span>{amenity}</li>)}</ul></section>
    <section className="floorplan-band section"><div className="shell floorplan-grid"><div><span className="eyebrow">Floor plans</span><h2>Space with purpose.</h2><p>Balanced private and social zones, generous light and intuitive movement through every level.</p><div className="floor-tabs"><button className="active">Ground floor</button><button>First floor</button><button>Roof terrace</button></div></div><div className="floorplan"><div className="plan-room room-one">LIVING<br /><small>8.4 × 6.8m</small></div><div className="plan-room room-two">DINING</div><div className="plan-room room-three">KITCHEN</div><div className="plan-room room-four">COURTYARD</div><span className="north">N ↑</span></div></div></section>
    <section className="location-section"><div className="location-copy"><span className="eyebrow">The location</span><h2>{property.location}</h2><p>Connected to Dubai’s finest schools, dining, wellness and cultural destinations, while retaining a welcome sense of privacy.</p><ul><li><strong>12 min</strong> Downtown Dubai</li><li><strong>18 min</strong> Dubai International Airport</li><li><strong>10 min</strong> International schools</li></ul></div><iframe title={`Map of ${property.location}`} src={`https://www.google.com/maps?q=${encodeURIComponent(property.location + ", Dubai")}&output=embed`} loading="lazy" /></section>
    <section id="enquire" className="contact-band property-enquiry"><div className="shell contact-band-grid"><div><span className="eyebrow light">Private viewing</span><h2>Experience<br />{property.name}.</h2><p>Request current availability, detailed plans or a private appointment with a Divine advisor.</p></div><EnquiryForm title="Request property details" compact /></div></section>
    <section className="section shell"><div className="section-heading"><div><span className="eyebrow">You may also consider</span><h2>Related residences</h2></div></div><div className="property-grid">{related.map((item) => <PropertyCard property={item} key={item.slug} />)}</div></section><SiteFooter /></main>;
}
