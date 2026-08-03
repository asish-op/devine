"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Property } from "../data";
import { publicProperties } from "../lib/property-api";
import { PropertyCard } from "./PropertyCard";

export function useLiveProperties() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const remote = await publicProperties(signal);
      setItems(remote);
      setFailed(false);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => refresh(controller.signal));
    const channel = new BroadcastChannel("divine-property-studio");
    channel.onmessage = () => void refresh();
    return () => { controller.abort(); channel.close(); };
  }, [refresh]);

  return { items, loading, failed };
}

function CollectionState({ loading, failed }: { loading: boolean; failed: boolean }) {
  if (loading) return <div className="empty-collection"><span>Live collection</span><h2>Loading current residences.</h2></div>;
  if (failed) return <div className="empty-collection"><span>Collection unavailable</span><h2>Current residences could not be loaded.</h2><p>Please try again shortly.</p></div>;
  return <div className="empty-collection"><span>Private collection</span><h2>No properties are published yet.</h2><p>New residences can be published from the property studio.</p></div>;
}

export function FeaturedPropertyAside() {
  const { items, loading } = useLiveProperties();
  const featured = [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))[0];

  if (!featured) return <div className="hero-aside"><span>Live collection</span><p>{loading ? "Loading residences" : "Private opportunities"}<br /><strong>Curated by Divine</strong></p></div>;

  return <div className="hero-aside"><span>01 / {String(items.length).padStart(2, "0")}</span><p><Link href={`/properties/${featured.slug}`}>{featured.name}</Link><br /><strong>{featured.location}</strong></p></div>;
}

export function LivePropertyGrid({ limit, className = "" }: { limit?: number; className?: string }) {
  const { items, loading, failed } = useLiveProperties();
  const ordered = [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const visible = typeof limit === "number" ? ordered.slice(0, limit) : ordered;
  return <div className={`property-grid ${className}`}>{visible.length ? visible.map((property, index) => <PropertyCard key={property.slug} property={property} featured={index === 0 && Boolean(limit)} />) : <CollectionState loading={loading} failed={failed} />}</div>;
}

export function PropertyExplorer() {
  const { items, loading, failed } = useLiveProperties();
  const [type, setType] = useState("All residences");
  const filtered = useMemo(() => type === "All residences" ? items : items.filter((item) => item.type.toLowerCase().includes(type.toLowerCase().replace(/s$/, ""))), [items, type]);
  const filters = ["All residences", "Villas", "Apartments", "Penthouses"];
  const hasPublishedProperties = items.length > 0;

  return <>
    <section className="property-toolbar shell"><div>{filters.map((filter) => <button type="button" key={filter} className={filter === type ? "active" : ""} onClick={() => setType(filter)}>{filter}</button>)}</div><span>{filtered.length} selected {filtered.length === 1 ? "property" : "properties"}</span></section>
    <section className="section shell property-grid listing-grid">{filtered.length ? filtered.map((property, index) => <PropertyCard key={property.slug} property={property} featured={index === 0} />) : hasPublishedProperties ? <div className="empty-collection"><span>Nothing ordinary here.</span><h2>No residences match this edit.</h2><button className="text-link" onClick={() => setType("All residences")}>Reset the collection <span>↗</span></button></div> : <CollectionState loading={loading} failed={failed} />}</section>
  </>;
}

export function DeveloperDirectory({ developers }: { developers: Array<{ slug: string; name: string; note: string }> }) {
  const { items, loading } = useLiveProperties();

  return <div className="developer-directory">{developers.map((developer, index) => {
    const count = items.filter((property) => property.developerSlug === developer.slug).length;
    const label = loading ? "Loading projects" : count ? `${count} ${count === 1 ? "project" : "projects"}` : "No current projects";
    return <Link href={`/developers/${developer.slug}`} key={developer.slug}><span>{String(index + 1).padStart(2, "0")}</span><strong>{developer.name}</strong><p>{developer.note}</p><em>{label}</em><i>↗</i></Link>;
  })}</div>;
}

export function DeveloperPropertyGrid({ developerSlug }: { developerSlug: string }) {
  const { items, loading, failed } = useLiveProperties();
  const portfolio = items.filter((item) => item.developerSlug === developerSlug);
  return <div className="shell property-grid">{portfolio.length ? portfolio.map((property) => <PropertyCard property={property} key={property.slug} />) : <CollectionState loading={loading} failed={failed} />}</div>;
}
