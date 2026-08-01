"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import type { Property } from "../data";
import { db } from "../lib/firebase";
import { PropertyCard } from "./PropertyCard";

function normalizeProperty(value: Partial<Property>, id: string): Property | null {
  if (!value.name || !value.image || !value.location) return null;
  return {
    slug: value.slug || id,
    name: value.name,
    developer: value.developer || "Private developer",
    developerSlug: value.developerSlug || "private-developer",
    location: value.location,
    type: value.type || "Residence",
    price: value.price || "Price on request",
    bedrooms: value.bedrooms || "Upon request",
    area: value.area || "Upon request",
    completion: value.completion || "Upon request",
    image: value.image,
    gallery: Array.isArray(value.gallery) && value.gallery.length ? value.gallery : [value.image, value.image, value.image],
    description: value.description || "A distinguished residence selected by Divine Luxury Properties.",
    amenities: Array.isArray(value.amenities) ? value.amenities : [],
    published: value.published !== false,
  };
}

export function useLiveProperties(fallback: Property[]) {
  const [remote, setRemote] = useState<Property[] | null>(null);
  useEffect(() => {
    if (!db) return;
    return onSnapshot(query(collection(db, "properties"), where("published", "==", true)), (snapshot) => {
      const next = snapshot.docs
        .map((item) => normalizeProperty(item.data() as Partial<Property>, item.id))
        .filter((item): item is Property => Boolean(item?.published));
      setRemote(next.length ? next : null);
    }, () => setRemote(null));
  }, []);
  return remote || fallback;
}

export function LivePropertyGrid({ fallback, limit, className = "" }: { fallback: Property[]; limit?: number; className?: string }) {
  const items = useLiveProperties(fallback);
  const visible = typeof limit === "number" ? items.slice(0, limit) : items;
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
