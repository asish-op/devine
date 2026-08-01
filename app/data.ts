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
  description: string;
  amenities: string[];
  published?: boolean;
};

export const properties: Property[] = [
  {
    slug: "celeste-residences",
    name: "Celeste Residences",
    developer: "Emaar",
    developerSlug: "emaar",
    location: "Dubai Hills Estate",
    type: "Private villas",
    price: "AED 12.8M",
    bedrooms: "5–6 bedrooms",
    area: "8,420–11,200 sq ft",
    completion: "Q4 2027",
    image: "/images/hero-villa.jpg",
    gallery: ["/images/hero-villa.jpg", "/images/project-one.jpg", "/images/project-two.jpg"],
    description:
      "A limited collection of contemporary villas shaped around mature landscapes, private courtyards and expansive indoor–outdoor living. Every residence pairs architectural clarity with calm, tactile interiors.",
    amenities: ["Residents’ clubhouse", "Private pool", "24-hour concierge", "Wellness pavilion", "Padel court", "Direct park access"],
  },
  {
    slug: "one-canal-penthouse",
    name: "One Canal Penthouse",
    developer: "AHS Properties",
    developerSlug: "ahs-properties",
    location: "Dubai Water Canal",
    type: "Sky penthouse",
    price: "AED 48M",
    bedrooms: "4 bedrooms",
    area: "9,138 sq ft",
    completion: "Ready",
    image: "/images/project-one.jpg",
    gallery: ["/images/project-one.jpg", "/images/project-two.jpg", "/images/interior.jpg"],
    description:
      "A full-floor residence with uninterrupted canal views, private lift access and interiors composed in travertine, smoked oak and brushed bronze. Designed for quiet entertaining above the city.",
    amenities: ["Private lift lobby", "Sky pool", "Residents’ cinema", "Valet parking", "24-hour concierge", "Private dining room"],
  },
  {
    slug: "the-reserve-villas",
    name: "The Reserve Villas",
    developer: "Sobha Realty",
    developerSlug: "sobha-realty",
    location: "Sobha Hartland II",
    type: "Waterfront villas",
    price: "AED 17.5M",
    bedrooms: "6 bedrooms",
    area: "10,366 sq ft",
    completion: "Q2 2028",
    image: "/images/project-four.jpg",
    gallery: ["/images/project-four.jpg", "/images/about-home.jpg", "/images/hero-villa.jpg"],
    description:
      "Waterfront family residences with double-height living spaces, landscaped arrival courts and a private edge to the lagoon. A measured expression of resort living in the city.",
    amenities: ["Private lagoon access", "Club lounge", "Fitness studio", "Children’s pavilion", "Landscape maintenance", "Gated arrival"],
  },
  {
    slug: "arbour-house",
    name: "Arbour House",
    developer: "Meraas",
    developerSlug: "meraas",
    location: "Jumeirah",
    type: "Garden residences",
    price: "AED 8.2M",
    bedrooms: "3–4 bedrooms",
    area: "3,900–5,140 sq ft",
    completion: "Q1 2027",
    image: "/images/project-three.jpg",
    gallery: ["/images/project-three.jpg", "/images/interior.jpg", "/images/project-two.jpg"],
    description:
      "Low-rise residences set within a private garden enclave, moments from the coast. Natural materials, filtered daylight and deep terraces create a distinctly residential rhythm.",
    amenities: ["Garden pool", "Private gym", "Library lounge", "Guest suite", "Beach access", "Residents’ garden"],
  },
];

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
