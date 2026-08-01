import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { EnquiryForm } from "../components/Forms";

export const metadata: Metadata = { title: "Contact Us" };
export default function ContactPage() { return <main id="top"><PageHero eyebrow="Contact" title="A private conversation starts here." description="Whether you are ready to move or simply exploring what is possible, we would be pleased to hear from you." />
  <section className="section shell contact-layout"><div className="contact-details"><span className="eyebrow">Divine private office</span><h2>Downtown Dubai</h2><p>Boulevard Plaza, Tower 1<br />Sheikh Mohammed bin Rashid Boulevard<br />Dubai, United Arab Emirates</p><div><span>Telephone</span><a href="tel:+97145550188">+971 4 555 0188</a></div><div><span>Email</span><a href="mailto:enquiries@divineluxury.ae">enquiries@divineluxury.ae</a></div><div><span>Office hours</span><p>Monday–Friday · 9:00–18:00<br />Saturday · By appointment</p></div><div className="social-row"><a href="#">Instagram ↗</a><a href="#">LinkedIn ↗</a><a href="#">YouTube ↗</a></div></div><EnquiryForm /></section>
  <section className="contact-map"><iframe title="Divine Luxury Properties office map" src="https://www.google.com/maps?q=Boulevard+Plaza+Downtown+Dubai&output=embed" loading="lazy" /><a href="https://wa.me/97145550188" target="_blank" rel="noreferrer">Chat with us on WhatsApp <span>↗</span></a></section><SiteFooter /></main>; }
