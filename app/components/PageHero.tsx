import { SiteHeader } from "./SiteHeader";

export function PageHero({ eyebrow, title, description, image, compact = false }: { eyebrow: string; title: string; description?: string; image?: string; compact?: boolean }) {
  return (
    <>
      <SiteHeader overlay={Boolean(image)} />
      <section className={`page-hero ${image ? "with-image" : "plain"} ${compact ? "compact" : ""}`} style={image ? { backgroundImage: `linear-gradient(90deg, rgba(8,8,7,.74), rgba(8,8,7,.15)), url(${image})` } : undefined}>
        <div className="shell page-hero-inner">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </section>
    </>
  );
}
