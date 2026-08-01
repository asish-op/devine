import type { Metadata } from "next";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { CareerForm } from "../components/Forms";

export const metadata: Metadata = { title: "Careers" };
const roles = [["Senior Property Advisor", "Sales · Dubai", "5+ years"], ["Marketing Executive", "Brand · Dubai", "3+ years"], ["Client Services Coordinator", "Operations · Dubai", "2+ years"]];
export default function CareersPage() { return <main id="top"><PageHero eyebrow="Careers" title="Ambitious people. Considered work." description="Join a close-knit team raising the standard of private real estate advisory in Dubai." image="/images/interior.jpg" />
  <section className="section shell culture-grid"><div><span className="eyebrow">Life at Divine</span><h2>Excellence without ego.</h2></div><div><p className="large-copy">Our clients expect the exceptional. We believe the best way to deliver it is with a culture built on trust, curiosity and collective ambition.</p><p>You will work alongside experienced people who share knowledge generously, take ownership seriously and know that good judgment cannot be rushed.</p></div></section>
  <section className="culture-cards shell"><article><span>01</span><h3>Room to think</h3><p>Autonomy, clear expectations and time to do thoughtful work.</p></article><article><span>02</span><h3>Shared standards</h3><p>High expectations supported by genuine collaboration and respect.</p></article><article><span>03</span><h3>Meaningful growth</h3><p>Mentorship, market exposure and a path shaped around your strengths.</p></article></section>
  <section className="section shell vacancies"><div className="section-heading"><div><span className="eyebrow">Current opportunities</span><h2>Find your place.</h2></div><p>We look for composure, commercial instinct and a natural care for people.</p></div>{roles.map(([role, team, exp]) => <a href="#apply" key={role}><span>{role}</span><p>{team}</p><small>{exp}</small><i>↗</i></a>)}</section>
  <section id="apply" className="career-apply"><div className="shell"><CareerForm /></div></section><SiteFooter /></main>; }
