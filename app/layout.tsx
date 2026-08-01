import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://divineluxury.ae"),
  title: { default: "Divine Luxury Properties | Private Real Estate Dubai", template: "%s | Divine Luxury Properties" },
  description: "Independent luxury real estate advisory offering privileged access to exceptional homes and investments in Dubai.",
  icons: { icon: "/divine-monogram.png", shortcut: "/divine-monogram.png", apple: "/divine-monogram.png" },
  openGraph: { title: "Divine Luxury Properties", description: "Remarkable homes. Discreetly found.", type: "website", locale: "en_AE", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Divine Luxury Properties - Remarkable homes. Discreetly found." }] },
  twitter: { card: "summary_large_image", title: "Divine Luxury Properties", description: "Remarkable homes. Discreetly found.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
