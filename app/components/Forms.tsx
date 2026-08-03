"use client";

import { FormEvent, useState } from "react";
import { submitEnquiry } from "../lib/property-api";

export function EnquiryForm({ title = "Begin a private conversation", compact = false, source = "Website", propertyName = "" }: { title?: string; compact?: boolean; source?: string; propertyName?: string }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await submitEnquiry({
        name: String(values.name || ""),
        email: String(values.email || ""),
        phone: String(values.phone || ""),
        interest: String(values.interest || ""),
        message: String(values.message || ""),
        website: String(values.website || ""),
        source,
        propertyName,
      });
      form.reset();
      setSent(true);
    } catch (requestError) { setError((requestError as Error).message); }
    finally { setSending(false); }
  };
  if (sent) return <div className="form-success"><span>✓</span><h3>Thank you.</h3><p>A private advisor will contact you within one business day.</p><button className="text-link" onClick={() => setSent(false)}>Send another enquiry</button></div>;
  return (
    <form className={`enquiry-form ${compact ? "compact-form" : ""}`} onSubmit={submit}>
      <span className="eyebrow">Private enquiry</span><h2>{title}</h2>
      <label className="website-trap" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="form-grid">
        <label><span>Full name</span><input name="name" autoComplete="name" required placeholder="Your name" /></label>
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label><span>Phone number</span><input name="phone" type="tel" autoComplete="tel" required placeholder="+971" /></label>
        <label><span>I am interested in</span><select name="interest" required defaultValue=""><option value="" disabled>Select an option</option><option>Buying a residence</option><option>Selling a property</option><option>Investment advisory</option><option>Relocation support</option></select></label>
      </div>
      <label><span>How can we help?</span><textarea name="message" rows={3} placeholder="Tell us what you are looking for" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-gold" type="submit" disabled={sending}>{sending ? "Sending enquiry…" : "Request consultation"} <span>↗</span></button>
    </form>
  );
}

export function CareerForm() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  if (sent) return <div className="form-success"><span>✓</span><h3>Application received.</h3><p>Our team will review your profile and be in touch if there is a fit.</p></div>;
  return (
    <form className="enquiry-form career-form" onSubmit={submit}>
      <span className="eyebrow">Apply now</span><h2>Make your next move.</h2>
      <div className="form-grid"><label><span>Full name</span><input required placeholder="Your name" /></label><label><span>Email</span><input type="email" required placeholder="you@example.com" /></label><label><span>Role</span><select defaultValue=""><option value="" disabled>Select a position</option><option>Senior Property Advisor</option><option>Marketing Executive</option><option>Client Services Coordinator</option><option>General application</option></select></label><label><span>LinkedIn profile</span><input type="url" placeholder="https://linkedin.com/in/…" /></label></div>
      <label><span>Introduce yourself</span><textarea rows={4} placeholder="A short note about your experience" /></label>
      <label className="file-field"><span>CV / Résumé</span><input type="file" accept=".pdf,.doc,.docx" required /></label>
      <button className="button button-gold" type="submit">Submit application <span>↗</span></button>
    </form>
  );
}
