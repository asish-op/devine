export type Property = {
  slug: string;
  name: string;
  developer: string;
  developerSlug: string;
  location: string;
  type: string;
  price: string;
  bedrooms: string;
  area: string;
  completion: string;
  image: string;
  gallery: string[];
  video?: string;
  brochure?: string;
  description: string;
  secondaryDescription?: string;
  tagline?: string;
  amenities: string[];
  floorPlans?: string[];
  mapQuery?: string;
  mapEmbedUrl?: string;
  locationDescription?: string;
  locationHighlights?: string[];
  statusLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const developers = [
  { slug: "emaar", name: "EMAAR", note: "Landmark communities" },
  { slug: "sobha-realty", name: "SOBHA", note: "Craft-led residences" },
  { slug: "meraas", name: "MERAAS", note: "Design-led destinations" },
  { slug: "ahs-properties", name: "AHS", note: "Ultra-prime homes" },
  { slug: "nakheel", name: "NAKHEEL", note: "Waterfront icons" },
  { slug: "ellington", name: "ELLINGTON", note: "Boutique living" },
];

export const uaePartners = [
  "Reportage Properties",
  "Danube Properties",
  "Sobha Realty",
  "DAMAC",
  "Meraas",
  "Binghatti",
  "Emaar",
  "Azizi Developments",
  "Nakheel",
  "Ellington Properties",
  "Dubai Properties",
  "Marriott",
  "Vincitore",
  "Tiger Properties",
  "Meraki Developers",
  "Samana Developers",
  "Dugasta",
];

export const indiaPartners = [
  "Nikhila Constructions and Developers",
  "Tranquillo Projects and Holdings Pvt Ltd",
  "Suchirindia",
  "Srigdha",
  "Puravankara",
  "Rustomjee",
  "Mahindra Lifespaces",
  "Lodha",
  "Piramal Realty",
  "Urbanrise",
  "Pooja Crafted Homes",
  "Godrej Properties",
  "Larsen & Toubro",
];

export const insights = [
  {
    category: "Market Perspective",
    date: "24 July 2026",
    title: "The new language of Dubai’s ultra-prime market",
    excerpt: "Privacy, provenance and long-term liveability are reshaping what discerning buyers value most.",
    image: "/images/hero-villa.jpg",
  },
  {
    category: "Design",
    date: "08 July 2026",
    title: "Why material restraint is the truest form of luxury",
    excerpt: "Inside the quiet shift toward natural stone, crafted timber and spaces designed to age beautifully.",
    image: "/images/interior.jpg",
  },
  {
    category: "Neighbourhood Guide",
    date: "19 June 2026",
    title: "Dubai Hills: a considered guide to park-side living",
    excerpt: "From early morning walks to architectural villas, the details that make this district feel complete.",
    image: "/images/about-home.jpg",
  },
];
