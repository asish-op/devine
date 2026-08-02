"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import type { Property } from "../data";
import { properties as sampleProperties } from "../data";
import { auth, db, isFirebaseConfigured } from "../lib/firebase";

const blankProperty: Property = {
  slug: "",
  name: "",
  developer: "",
  developerSlug: "",
  location: "",
  type: "Private villa",
  price: "",
  bedrooms: "",
  area: "",
  completion: "",
  image: "",
  gallery: [],
  description: "",
  amenities: [],
  published: true,
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [items, setItems] = useState<Property[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<Property>(blankProperty);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [galleryText, setGalleryText] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!auth) { setAuthReady(true); return; }
    return onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setAuthReady(true); });
  }, []);

  useEffect(() => {
    if (!db || !user) { setLoadingItems(false); return; }
    setLoadingItems(true);
    return onSnapshot(collection(db, "properties"), (snapshot) => {
      setItems(snapshot.docs.map((item) => ({ ...(item.data() as Property), slug: (item.data() as Property).slug || item.id })));
      setLoadingItems(false);
    }, () => setLoadingItems(false));
  }, [user]);

  const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.location} ${item.developer}`.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const publishedCount = items.filter((item) => item.published !== false).length;
  const readyCount = items.filter((item) => item.completion?.toLowerCase() === "ready").length;

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) return;
    setAuthError("");
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setAuthError("We could not sign you in. Check your details and try again."); }
  }

  function openCreate() {
    setEditingSlug(null);
    setDraft(blankProperty);
    setAmenitiesText("");
    setGalleryText("");
    setEditorOpen(true);
  }

  function openEdit(property: Property) {
    setEditingSlug(property.slug);
    setDraft(property);
    setAmenitiesText(property.amenities.join("\n"));
    setGalleryText(property.gallery.join("\n"));
    setEditorOpen(true);
  }

  function update<K extends keyof Property>(key: K, value: Property[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db) return;
    const slug = editingSlug || slugify(draft.slug || draft.name);
    if (!slug) return;
    setSaving(true);
    try {
      const gallery = galleryText.split("\n").map((item) => item.trim()).filter(Boolean);
      const amenities = amenitiesText.split("\n").map((item) => item.trim()).filter(Boolean);
      const payload = { ...draft, slug, developerSlug: draft.developerSlug || slugify(draft.developer), gallery: gallery.length ? gallery : [draft.image, draft.image, draft.image], amenities, updatedAt: serverTimestamp() };
      await setDoc(doc(db, "properties", slug), payload, { merge: true });
      setNotice(editingSlug ? "Property updated." : "Property created.");
      setEditorOpen(false);
      window.setTimeout(() => setNotice(""), 3200);
    } finally { setSaving(false); }
  }

  async function removeProperty(property: Property) {
    if (!db || !window.confirm(`Remove ${property.name} from the catalogue?`)) return;
    await deleteDoc(doc(db, "properties", property.slug));
    setNotice("Property removed.");
    window.setTimeout(() => setNotice(""), 3200);
  }

  async function seedCatalogue() {
    if (!db) return;
    const firestore = db;
    setSaving(true);
    try {
      const batch = writeBatch(firestore);
      sampleProperties.forEach((property) => batch.set(doc(firestore, "properties", property.slug), { ...property, published: true, updatedAt: serverTimestamp() }));
      await batch.commit();
      setNotice("The signature catalogue is now live in Firebase.");
      window.setTimeout(() => setNotice(""), 4000);
    } finally { setSaving(false); }
  }

  if (!isFirebaseConfigured) return <AdminSetup />;
  if (!authReady) return <div className="admin-loading"><div className="admin-spinner" /><span>Opening Property Studio</span></div>;
  if (!user) return <AdminLogin email={email} password={password} error={authError} onEmail={setEmail} onPassword={setPassword} onSubmit={handleLogin} />;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand"><span className="brand-mark admin-brand-mark" aria-hidden="true" /><div><strong>DIVINE</strong><span>PROPERTY STUDIO</span></div></Link>
      <nav><button className="active"><span>⌂</span>Overview</button><button><span>◇</span>Properties <em>{items.length}</em></button><button disabled><span>□</span>Media library <small>Soon</small></button><button disabled><span>◎</span>Enquiries <small>Soon</small></button></nav>
      <div className="admin-sidebar-foot"><div className="admin-avatar">{user.email?.slice(0, 2).toUpperCase()}</div><div><strong>{user.email}</strong><button onClick={() => auth && signOut(auth)}>Sign out</button></div></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><span>Divine collection</span><h1>Property Studio</h1></div><div><Link href="/properties" target="_blank">View live collection ↗</Link><button className="admin-primary" onClick={openCreate}><span>＋</span>Add property</button></div></header>
      {notice && <div className="admin-notice"><span>✓</span>{notice}</div>}
      <div className="admin-stats"><article><span>Live properties</span><strong>{publishedCount.toString().padStart(2, "0")}</strong><small>Visible on website</small></article><article><span>Ready residences</span><strong>{readyCount.toString().padStart(2, "0")}</strong><small>Available now</small></article><article><span>Off-plan</span><strong>{Math.max(publishedCount - readyCount, 0).toString().padStart(2, "0")}</strong><small>Future completions</small></article><article className="admin-stat-accent"><span>Collection health</span><strong>{items.length ? "Live" : "Setup"}</strong><small>{items.length ? "Firebase is connected" : "Import the signature collection"}</small></article></div>
      <div className="admin-collection-head"><div><span>Catalogue</span><h2>Properties</h2></div><label><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search residences" /></label></div>
      <div className="admin-table">
        <div className="admin-table-head"><span>Residence</span><span>Location</span><span>Value</span><span>Status</span><span /></div>
        {loadingItems ? <div className="admin-table-empty">Loading your collection...</div> : filtered.length ? filtered.map((property) => <article key={property.slug}>
          <div className="admin-property-name"><img src={property.image} alt="" /><div><strong>{property.name}</strong><span>{property.developer} · {property.type}</span></div></div><span>{property.location}</span><span>{property.price}</span><span><i className={property.published === false ? "draft" : "published"} />{property.published === false ? "Draft" : "Published"}</span><div className="admin-row-actions"><button onClick={() => openEdit(property)} aria-label={`Edit ${property.name}`}>Edit</button><button onClick={() => removeProperty(property)} aria-label={`Delete ${property.name}`}>•••</button></div>
        </article>) : <div className="admin-table-empty"><span>◇</span><h3>Your collection is ready to be curated.</h3><p>Import the signature properties or add your first residence from scratch.</p><div><button className="admin-secondary" disabled={saving} onClick={seedCatalogue}>Import signature collection</button><button className="admin-primary" onClick={openCreate}>Add a property</button></div></div>}
      </div>
    </section>
    {editorOpen && <div className="admin-editor-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setEditorOpen(false)}><aside className="admin-editor">
      <header><div><span>{editingSlug ? "Edit residence" : "New residence"}</span><h2>{editingSlug ? draft.name : "Add to collection"}</h2></div><button onClick={() => setEditorOpen(false)} aria-label="Close editor">×</button></header>
      <form onSubmit={saveProperty}><div className="admin-form-section"><div className="admin-form-label"><span>01</span><div><strong>Identity</strong><small>Core property information</small></div></div><div className="admin-form-fields"><label className="full"><span>Property name</span><input required value={draft.name} onChange={(event) => { update("name", event.target.value); if (!editingSlug) update("slug", slugify(event.target.value)); }} placeholder="e.g. Celeste Residences" /></label><label><span>URL slug</span><input required readOnly={Boolean(editingSlug)} value={draft.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></label><label><span>Property type</span><select value={draft.type} onChange={(event) => update("type", event.target.value)}><option>Private villa</option><option>Waterfront villa</option><option>Apartment</option><option>Sky penthouse</option><option>Garden residence</option></select></label><label><span>Developer</span><input required value={draft.developer} onChange={(event) => update("developer", event.target.value)} /></label><label><span>Location</span><input required value={draft.location} onChange={(event) => update("location", event.target.value)} /></label></div></div>
        <div className="admin-form-section"><div className="admin-form-label"><span>02</span><div><strong>Commercials</strong><small>Key listing facts</small></div></div><div className="admin-form-fields"><label><span>Price</span><input required value={draft.price} onChange={(event) => update("price", event.target.value)} placeholder="AED 12.8M" /></label><label><span>Bedrooms</span><input required value={draft.bedrooms} onChange={(event) => update("bedrooms", event.target.value)} placeholder="5-6 bedrooms" /></label><label><span>Residence size</span><input required value={draft.area} onChange={(event) => update("area", event.target.value)} placeholder="8,420-11,200 sq ft" /></label><label><span>Completion</span><input required value={draft.completion} onChange={(event) => update("completion", event.target.value)} placeholder="Q4 2027 or Ready" /></label></div></div>
        <div className="admin-form-section"><div className="admin-form-label"><span>03</span><div><strong>Story & media</strong><small>The editorial presentation</small></div></div><div className="admin-form-fields"><label className="full"><span>Overview</span><textarea required rows={4} value={draft.description} onChange={(event) => update("description", event.target.value)} /></label><label className="full"><span>Cover image URL or public path</span><input required value={draft.image} onChange={(event) => update("image", event.target.value)} placeholder="/images/residence.jpg" /></label>{draft.image && <div className="admin-image-preview full"><img src={draft.image} alt="Property preview" /><span>Cover preview</span></div>}<label className="full"><span>Gallery images · one URL per line</span><textarea rows={4} value={galleryText} onChange={(event) => setGalleryText(event.target.value)} placeholder="/images/gallery-one.jpg" /></label><label className="full"><span>Amenities · one per line</span><textarea rows={5} value={amenitiesText} onChange={(event) => setAmenitiesText(event.target.value)} placeholder={"Private pool\n24-hour concierge\nResidents' clubhouse"} /></label></div></div>
        <label className="admin-publish-toggle"><input type="checkbox" checked={draft.published !== false} onChange={(event) => update("published", event.target.checked)} /><span><i />Publish this residence</span><small>Published properties appear in the live collection immediately.</small></label>
        <footer><button type="button" className="admin-secondary" onClick={() => setEditorOpen(false)}>Cancel</button><button className="admin-primary" type="submit" disabled={saving}>{saving ? "Saving..." : editingSlug ? "Save changes" : "Publish property"}</button></footer>
      </form>
    </aside></div>}
  </main>;
}

function AdminLogin({ email, password, error, onEmail, onPassword, onSubmit }: { email: string; password: string; error: string; onEmail: (value: string) => void; onPassword: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <main className="admin-login"><div className="admin-login-image"><Link href="/" className="admin-brand"><span className="brand-mark admin-brand-mark" aria-hidden="true" /><div><strong>DIVINE</strong><span>PROPERTY STUDIO</span></div></Link><div><span className="eyebrow light">Private administration</span><h1>Curate the<br /><em>exceptional.</em></h1><p>A composed workspace for the homes that define your collection.</p></div><small>Divine Luxury Properties · Dubai</small></div><div className="admin-login-panel"><form onSubmit={onSubmit}><span className="admin-kicker">Secure access</span><h2>Welcome back.</h2><p>Sign in with your authorised Firebase account.</p>{error && <div className="admin-auth-error">{error}</div>}<label><span>Email address</span><input type="email" autoComplete="email" required value={email} onChange={(event) => onEmail(event.target.value)} placeholder="advisor@divineluxury.ae" /></label><label><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => onPassword(event.target.value)} placeholder="Your password" /></label><button className="admin-login-button" type="submit">Enter Property Studio <span>↗</span></button><Link href="/">← Return to the website</Link></form></div></main>;
}

function AdminSetup() {
  const keys = ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"];
  return <main className="admin-setup"><div className="admin-setup-card"><span className="brand-mark admin-setup-mark" role="img" aria-label="Divine Luxury Properties" /><span className="admin-kicker">One-time connection</span><h1>Connect Property Studio to Firebase.</h1><p>The admin experience is complete. Add your Firebase web app values to <code>.env.local</code>, enable Email/Password Authentication and create a Firestore database to bring it live.</p><div>{keys.map((key) => <code key={key}>{key}=</code>)}</div><small>Restart the website after saving the environment values.</small><Link href="/">← Return to the website</Link></div></main>;
}
