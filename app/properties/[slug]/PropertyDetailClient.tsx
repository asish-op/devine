"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EnquiryForm } from "../../components/Forms";
import { PropertyCard } from "../../components/PropertyCard";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { properties, type Property } from "../../data";
import { googleMapEmbedUrl, mediaUrl, publicProperty } from "../../lib/property-api";

export function PropertyDetailClient({ slug, fallback }: { slug: string; fallback: Property | null }) {
  const [property, setProperty] = useState<Property | null>(fallback);
  const [loading, setLoading] = useState(!fallback);
  const [failedVideo, setFailedVideo] = useState("");
  const [filmPlaying, setFilmPlaying] = useState(false);
  const [filmMuted, setFilmMuted] = useState(true);
  const filmRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    publicProperty(slug, controller.signal).then(setProperty).catch(() => undefined).finally(() => setLoading(false));
    return () => controller.abort();
  }, [slug]);

  function toggleFilm() {
    const film = filmRef.current;
    if (!film) return;
    if (film.paused) film.play().catch(() => setFailedVideo(property?.video || ""));
    else film.pause();
  }

  function toggleFilmSound() {
    const film = filmRef.current;
    if (!film) return;
    film.muted = !film.muted;
    setFilmMuted(film.muted);
  }

  if (loading) return <div className="property-loading"><div className="admin-spinner" /><span>Preparing residence</span></div>;
  if (!property) return <main id="top"><SiteHeader /><section className="missing-property"><span className="eyebrow">Private collection</span><h1>This residence is no longer publicly available.</h1><p>Our advisors may know of a comparable private opportunity.</p><Link href="/contact" className="button button-dark">Speak with an advisor <span>↗</span></Link></section><SiteFooter /></main>;

  const gallery = property.gallery?.length ? property.gallery : [property.image, property.image, property.image];
  const floorPlans = property.floorPlans || [];
  const locationHighlights = property.locationHighlights?.length ? property.locationHighlights : ["12 min · Downtown Dubai", "18 min · Dubai International Airport", "10 min · International schools"];
  const mapSource = googleMapEmbedUrl(property.mapEmbedUrl, property.mapQuery || property.location + ", Dubai");
  const related = properties.filter((item) => item.slug !== slug).slice(0, 2);
  const showFilm = Boolean(property.video && failedVideo !== property.video);

  return <main id="top"><SiteHeader overlay />
    <section className="property-hero" style={showFilm ? undefined : { backgroundImage: `linear-gradient(0deg, rgba(5,5,4,.7), rgba(5,5,4,.08)), url(${mediaUrl(property.image)})` }}>
      {showFilm && <><video ref={filmRef} className="property-hero-video" src={mediaUrl(property.video)} poster={mediaUrl(property.image)} autoPlay muted={filmMuted} loop playsInline preload="metadata" onPlaying={() => setFilmPlaying(true)} onPause={() => setFilmPlaying(false)} onError={() => setFailedVideo(property.video || "")} /><span className="property-hero-video-shade" /><div className="property-film-controls"><button type="button" onClick={toggleFilm} aria-label={filmPlaying ? "Pause property film" : "Play property film"}><span>{filmPlaying ? "Ⅱ" : "▶"}</span>{filmPlaying ? "Pause film" : "Play film"}</button><button type="button" onClick={toggleFilmSound} aria-label={filmMuted ? "Turn property film sound on" : "Mute property film"} aria-pressed={!filmMuted}><span>{filmMuted ? "◇" : "◈"}</span>{filmMuted ? "Sound on" : "Mute"}</button></div></>}
      <div className="property-hero-rail"><span>DIVINE COLLECTION</span><i /><span>{property.location}</span></div>
      <div className="shell property-hero-copy"><span className="eyebrow light">{property.developer} · {property.type}</span><h1>{property.name}</h1><div><p>{property.location}</p><strong>From {property.price}</strong></div></div>
    </section>
    <section className="property-facts"><div className="shell"><span><small>Configuration</small>{property.bedrooms}</span><span><small>Residence size</small>{property.area}</span><span><small>Completion</small>{property.completion}</span><span><small>Developer</small><Link href={`/developers/${property.developerSlug}`}>{property.developer} ↗</Link></span>{property.brochure ? <a className="button button-dark" href={mediaUrl(property.brochure)} target="_blank" rel="noreferrer">Download brochure <span>↓</span></a> : <a className="button button-dark" href="#enquire">Request details <span>↗</span></a>}</div></section>
    <section className="section shell property-overview"><div><span className="eyebrow">The residence</span><h2>{property.tagline || "Architecture in service of a remarkable life."}</h2></div><div><p className="large-copy">{property.description}</p><p>{property.secondaryDescription || "Thoughtful orientation, generous proportions and a restrained material palette create spaces that feel composed in every season. Private outdoor rooms extend daily life into the landscape."}</p><a href="#enquire" className="text-link">Request a private viewing <span>↗</span></a></div></section>
    <section className="property-gallery property-gallery-complete shell">{gallery.map((image, index) => <figure className={index === 0 ? "property-gallery-lead" : ""} key={`${image}-${index}`}><img src={mediaUrl(image)} alt={`${property.name} gallery image ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />{index === 0 && <figcaption>{String(gallery.length).padStart(2, "0")} images</figcaption>}</figure>)}</section>
    <section className="section shell amenities-section"><div><span className="eyebrow">Amenities</span><h2>Every detail,<br />already considered.</h2></div><ul>{property.amenities.map((amenity, index) => <li key={amenity}><span>{String(index + 1).padStart(2, "0")}</span>{amenity}</li>)}</ul></section>
    <section className="floorplan-band section"><div className="shell floorplan-grid"><div><span className="eyebrow">Floor plans</span><h2>Space with purpose.</h2><p>Balanced private and social zones, generous light and intuitive movement through every level.</p></div>{floorPlans.length ? <div className="uploaded-floorplans">{floorPlans.map((plan, index) => <figure key={plan}><img src={mediaUrl(plan)} alt={`${property.name} floor plan ${index + 1}`} /><figcaption>Plan {String(index + 1).padStart(2, "0")}</figcaption></figure>)}</div> : <div className="floorplan"><div className="plan-room room-one">LIVING<br /><small>8.4 × 6.8m</small></div><div className="plan-room room-two">DINING</div><div className="plan-room room-three">KITCHEN</div><div className="plan-room room-four">COURTYARD</div><span className="north">N ↑</span></div>}</div></section>
    <section className="location-section"><div className="location-copy"><span className="eyebrow">The location</span><h2>{property.location}</h2><p>{property.locationDescription || "Connected to Dubai’s finest schools, dining, wellness and cultural destinations, while retaining a welcome sense of privacy."}</p><ul>{locationHighlights.map((item) => { const [value, ...label] = item.split("·"); return <li key={item}><strong>{value.trim()}</strong>{label.join("·").trim()}</li>; })}</ul></div><iframe title={`Map of ${property.location}`} src={mapSource} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></section>
    <section id="enquire" className="contact-band property-enquiry"><div className="shell contact-band-grid"><div><span className="eyebrow light">Private viewing</span><h2>Experience<br />{property.name}.</h2><p>Request current availability, detailed plans or a private appointment with a Divine advisor.</p></div><EnquiryForm title="Request property details" compact source="Property page" propertyName={property.name} /></div></section>
    <section className="section shell"><div className="section-heading"><div><span className="eyebrow">You may also consider</span><h2>Related residences</h2></div></div><div className="property-grid">{related.map((item) => <PropertyCard property={item} key={item.slug} />)}</div></section>
    <SiteFooter />
  </main>;
}
