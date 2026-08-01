import type { Metadata } from "next";
import { properties } from "../../data";
import { PropertyDetailClient } from "./PropertyDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  return { title: property?.name || "Private Residence", description: property?.description || "A selected residence from Divine Luxury Properties." };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PropertyDetailClient slug={slug} fallback={properties.find((item) => item.slug === slug) || null} />;
}
