"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Property } from "../data";
import { publicProperties } from "../lib/property-api";
import { PropertyCard } from "./PropertyCard";

export function useLiveProperties(fallback: Property[]) {
  const [remote, setRemote] = useState<Property[] | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const items = await publicProperties(signal);
      setRemote(items);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setRemote(null);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal);
    const channel = new BroadcastChannel("divine-property-studio");
    channel.onmessage = () => refresh();
    return () => { controller.abort(); channel.close(); };
  }, [refresh]);

  return remote ?? fallback;
}

export function LivePropertyGrid({ fallback, limit, className = "" }: { fallback: Property[]; limit?: number; className?: string }) {
  const items = useLiveProperties(fallback);
  const ordered = [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const visible = typeof limit === "number" ? ordered.slice(0, limit) : ordered;
  return <div className={`property-grid ${className}`}>{visible.map((property, index) => <PropertyCard key={property.slug} property={property} featured={index === 0 && Boolean(limit)} />)}</div>;
}

export function PropertyExplorer({ fallback }: { fallback: Property[] }) {
  const items = useLiveProperties(fallback);
  const [type, setType] = useState("All residences");
  const filtered = useMemo(() => type === "All residences" ? items : items.filter((item) => item.type.toLowerCase().includes(type.toLowerCase().replace(/s$/, ""))), [items, type]);
  const filters = ["All residences", "Villas", "Apartments", "Penthouses"];
  return <>
    <section className="property-toolbar shell"><div>{filters.map((filter) => <button type="button" key={filter} className={filter === type ? "active" : ""} onClick={() => setType(filter)}>{filter}</button>)}</div><span>{filtered.length} selected {filtered.length === 1 ? "property" : "properties"}</span></section>
    <section className="section shell property-grid listing-grid">{filtered.length ? filtered.map((property, index) => <PropertyCard key={property.slug} property={property} featured={index === 0} />) : <div className="empty-collection"><span>Nothing ordinary here.</span><h2>No residences match this edit.</h2><button className="text-link" onClick={() => setType("All residences")}>Reset the collection <span>↗</span></button></div>}</section>
  </>;
}

export function DeveloperPropertyGrid({ fallback, developerSlug }: { fallback: Property[]; developerSlug: string }) {
  const items = useLiveProperties(fallback);
  const portfolio = items.filter((item) => item.developerSlug === developerSlug);
  const selected = portfolio.length ? portfolio : fallback.filter((item) => item.developerSlug === developerSlug);
  return <div className="shell property-grid">{selected.map((property) => <PropertyCard property={property} key={property.slug} />)}</div>;
}
