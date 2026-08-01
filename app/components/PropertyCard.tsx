import Link from "next/link";
import type { Property } from "../data";

export function PropertyCard({ property, featured = false }: { property: Property; featured?: boolean }) {
  return (
    <article className={`property-card ${featured ? "featured" : ""}`}>
      <Link href={`/properties/${property.slug}`} className="property-image" aria-label={`View ${property.name}`}>
        <img src={property.image} alt={`${property.name} in ${property.location}`} />
        <span className="property-status">{property.completion === "Ready" ? "Ready residence" : "New release"}</span>
        <span className="image-arrow">↗</span>
      </Link>
      <div className="property-copy">
        <div><span>{property.location}</span><h3><Link href={`/properties/${property.slug}`}>{property.name}</Link></h3><p>{property.type} · {property.bedrooms}</p></div>
        <strong>From {property.price}</strong>
      </div>
    </article>
  );
}
