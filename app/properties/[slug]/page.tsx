import type { Metadata } from "next";
import { properties, type Property } from "../../data";
import { PropertyDetailClient } from "./PropertyDetailClient";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

async function getProperty(slug: string): Promise<Property | null> {
  try {
    const response = await fetch(`${apiUrl}/api/properties/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (response.ok) return response.json();
  } catch {}
  return properties.find((item) => item.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  return { title: property?.seoTitle || property?.name || "Private Residence", description: property?.seoDescription || property?.description || "A selected residence from Divine Luxury Properties." };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PropertyDetailClient slug={slug} fallback={await getProperty(slug)} />;
}
