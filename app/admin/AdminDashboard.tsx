"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Property } from "../data";
import { ADMIN_TOKEN_KEY, adminRequest, announcePropertyUpdate, googleMapEmbedUrl, mediaUrl, type Enquiry, type UploadedMedia } from "../lib/property-api";

type AdminView = "overview" | "properties" | "media" | "enquiries";
type EditorSection = "details" | "media" | "location" | "seo";
type UploadTarget = "cover" | "gallery" | "video" | "brochure" | "floorPlans" | "library";

const blankProperty: Property = {
  slug: "", name: "", developer: "", developerSlug: "", location: "", type: "Private villa", price: "", bedrooms: "", area: "", completion: "", image: "", gallery: [], video: "", brochure: "", description: "", secondaryDescription: "", tagline: "", amenities: [], floorPlans: [], mapQuery: "", mapEmbedUrl: "", locationDescription: "", locationHighlights: [], statusLabel: "New release", seoTitle: "", seoDescription: "", featured: false, published: true,
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const lines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);
const asLines = (value?: string[]) => (value || []).join("\n");

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [view, setView] = useState<AdminView>("overview");
  const [items, setItems] = useState<Property[]>([]);
  const [media, setMedia] = useState<UploadedMedia[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<Property>(blankProperty);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [highlightsText, setHighlightsText] = useState("");
  const [editorSection, setEditorSection] = useState<EditorSection>("details");
  const [previewMode, setPreviewMode] = useState<"card" | "page">("page");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<UploadTarget | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const clearLocalSession = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setItems([]);
    setMedia([]);
    setEnquiries([]);
    setEmail("");
  }, []);

  const logout = useCallback(() => {
    if (token) adminRequest("/api/auth/logout", { method: "POST" }, token).catch(() => undefined);
    clearLocalSession();
  }, [clearLocalSession, token]);

  const loadProperties = useCallback(async (activeToken: string) => {
    try {
      const properties = await adminRequest<Property[]>("/api/properties?includeDrafts=1", {}, activeToken);
      setItems(properties);
      setError("");
    } catch (requestError) {
      if ((requestError as Error).message.toLowerCase().includes("session")) clearLocalSession();
      else setError((requestError as Error).message);
    } finally { setLoading(false); }
  }, [clearLocalSession]);

  const loadMedia = useCallback(async (activeToken: string) => {
    try { setMedia(await adminRequest<UploadedMedia[]>("/api/media", {}, activeToken)); }
    catch (requestError) { setError((requestError as Error).message); }
  }, []);

  const loadEnquiries = useCallback(async (activeToken: string) => {
    try { setEnquiries(await adminRequest<Enquiry[]>("/api/enquiries", {}, activeToken)); }
    catch (requestError) { setError((requestError as Error).message); }
  }, []);

  const loadSession = useCallback(async (activeToken: string) => {
    const session = await adminRequest<{ user: { email: string } }>("/api/auth/session", {}, activeToken);
    setEmail(session.user.email);
  }, []);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      await Promise.resolve();
      if (!active) return;
      const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!stored) {
        setLoading(false);
        setAuthReady(true);
        return;
      }
      setToken(stored);
      try { await Promise.all([loadSession(stored), loadProperties(stored), loadMedia(stored), loadEnquiries(stored)]); }
      catch { if (active) clearLocalSession(); }
      finally { if (active) setAuthReady(true); }
    }
    restoreSession();
    return () => { active = false; };
  }, [clearLocalSession, loadEnquiries, loadMedia, loadProperties, loadSession]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape" && editorOpen) setEditorOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [editorOpen]);

  const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.location} ${item.developer} ${item.type}`.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const publishedCount = items.filter((item) => item.published !== false).length;
  const featuredCount = items.filter((item) => item.featured).length;

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    try {
      const result = await adminRequest<{ token: string; user: { email: string } }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
      setToken(result.token);
      setEmail(result.user.email);
      setPassword("");
      setLoading(true);
      await Promise.all([loadProperties(result.token), loadMedia(result.token), loadEnquiries(result.token)]);
    } catch (requestError) { setAuthError((requestError as Error).message); }
  }

  function update<K extends keyof Property>(key: K, value: Property[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingSlug(null);
    setDraft({ ...blankProperty, gallery: [], amenities: [], floorPlans: [], locationHighlights: [] });
    setAmenitiesText("");
    setHighlightsText("");
    setEditorSection("details");
    setPreviewMode("page");
    setEditorOpen(true);
  }

  function openEdit(property: Property, preview = false) {
    setEditingSlug(property.slug);
    setDraft({ ...blankProperty, ...property, gallery: [...(property.gallery || [])], amenities: [...(property.amenities || [])], floorPlans: [...(property.floorPlans || [])], locationHighlights: [...(property.locationHighlights || [])] });
    setAmenitiesText(asLines(property.amenities));
    setHighlightsText(asLines(property.locationHighlights));
    setEditorSection(preview ? "media" : "details");
    setPreviewMode("page");
    setEditorOpen(true);
  }

  function duplicateProperty(property: Property) {
    const name = `${property.name} Copy`;
    setEditingSlug(null);
    setDraft({ ...property, name, slug: slugify(name), published: false, featured: false });
    setAmenitiesText(asLines(property.amenities));
    setHighlightsText(asLines(property.locationHighlights));
    setEditorSection("details");
    setEditorOpen(true);
  }

  async function saveProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const slug = slugify(draft.slug || draft.name);
    if (!slug) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...draft, slug, developerSlug: draft.developerSlug || slugify(draft.developer), gallery: draft.gallery?.length ? draft.gallery : draft.image ? [draft.image] : [], amenities: lines(amenitiesText), locationHighlights: lines(highlightsText) };
      const saved = await adminRequest<Property>(editingSlug ? `/api/properties/${editingSlug}` : "/api/properties", { method: editingSlug ? "PUT" : "POST", body: JSON.stringify(payload) }, token);
      setItems((current) => editingSlug ? current.map((item) => item.slug === editingSlug ? saved : item) : [saved, ...current]);
      announcePropertyUpdate();
      setEditorOpen(false);
      flash(editingSlug ? "Property changes are live." : "Property added to the collection.");
    } catch (requestError) { setError((requestError as Error).message); }
    finally { setSaving(false); }
  }

  async function removeProperty(property: Property) {
    if (!token || !window.confirm(`Permanently remove ${property.name}? Uploaded files will remain in the media library.`)) return;
    try {
      await adminRequest(`/api/properties/${property.slug}`, { method: "DELETE" }, token);
      setItems((current) => current.filter((item) => item.slug !== property.slug));
      announcePropertyUpdate();
      flash("Property removed from the catalogue.");
    } catch (requestError) { setError((requestError as Error).message); }
  }

  async function setEnquiryStatus(enquiry: Enquiry, status: Enquiry["status"]) {
    if (!token || enquiry.status === status) return;
    try {
      const updated = await adminRequest<Enquiry>(`/api/enquiries/${enquiry.id}`, { method: "PATCH", body: JSON.stringify({ status }) }, token);
      setEnquiries((current) => current.map((item) => item.id === updated.id ? updated : item));
      flash(status === "resolved" ? "Enquiry marked as resolved." : "Enquiry status updated.");
    } catch (requestError) { setError((requestError as Error).message); }
  }

  async function removeEnquiry(enquiry: Enquiry) {
    if (!token || !window.confirm(`Permanently delete the enquiry from ${enquiry.name}?`)) return;
    try {
      await adminRequest(`/api/enquiries/${enquiry.id}`, { method: "DELETE" }, token);
      setEnquiries((current) => current.filter((item) => item.id !== enquiry.id));
      flash("Enquiry deleted.");
    } catch (requestError) { setError((requestError as Error).message); }
  }

  async function uploadFiles(files: FileList | File[], target: UploadTarget) {
    if (!token || !files.length) return;
    const selectedFiles = Array.from(files);
    if (target === "video" && selectedFiles.some((file) => !/\.(mp4|webm)$/i.test(file.name))) {
      setError("Property films must be MP4 or WebM files so they play reliably in modern browsers.");
      return;
    }
    const form = new FormData();
    selectedFiles.forEach((file) => form.append("files", file));
    setUploading(target);
    setError("");
    try {
      const result = await adminRequest<{ files: UploadedMedia[] }>("/api/upload", { method: "POST", body: form }, token);
      const images = result.files.filter((item) => item.type === "image");
      const videos = result.files.filter((item) => item.type === "video");
      const documents = result.files.filter((item) => item.type === "document");
      if (target === "cover" && images[0]) update("image", images[0].url);
      if (target === "gallery" && images.length) setDraft((current) => ({ ...current, image: current.image || images[0].url, gallery: [...(current.gallery || []), ...images.map((item) => item.url)] }));
      if (target === "floorPlans" && images.length) setDraft((current) => ({ ...current, floorPlans: [...(current.floorPlans || []), ...images.map((item) => item.url)] }));
      if (target === "video") {
        if (!videos[0]) throw new Error("The API did not recognise this file as a browser-safe property film.");
        update("video", videos[0].url);
      }
      if (target === "brochure" && documents[0]) update("brochure", documents[0].url);
      setMedia((current) => [...result.files, ...current]);
      flash(`${result.files.length} file${result.files.length === 1 ? "" : "s"} uploaded.`);
    } catch (requestError) { setError((requestError as Error).message); }
    finally { setUploading(null); }
  }

  async function removeMedia(item: UploadedMedia) {
    if (!token || !window.confirm(`Delete ${item.name} from the media library? Make sure no property is using it.`)) return;
    const id = item.url.split("/").pop();
    if (!id) return;
    try {
      await adminRequest(`/api/media/${id}`, { method: "DELETE" }, token);
      setMedia((current) => current.filter((mediaItem) => mediaItem.url !== item.url));
      flash("Media deleted from MongoDB.");
    } catch (requestError) { setError((requestError as Error).message); }
  }

  if (!authReady) return <div className="admin-loading"><div className="admin-spinner" /><span>Opening Property Studio</span></div>;
  if (!token) return <AdminLogin email={email} password={password} error={authError} onEmail={setEmail} onPassword={setPassword} onSubmit={handleLogin} />;

  const newEnquiries = enquiries.filter((item) => item.status === "new").length;
  const title = view === "media" ? "Media Library" : view === "properties" ? "Properties" : view === "enquiries" ? "Client Enquiries" : "Property Studio";

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand"><span className="brand-mark admin-brand-mark" aria-hidden="true" /><div><strong>DIVINE</strong><span>PROPERTY STUDIO</span></div></Link>
      <nav>
        <button className={view === "overview" ? "active" : ""} onClick={() => setView("overview")}><span>⌂</span>Overview</button>
        <button className={view === "properties" ? "active" : ""} onClick={() => setView("properties")}><span>◇</span>Properties <em>{items.length}</em></button>
        <button className={view === "media" ? "active" : ""} onClick={() => setView("media")}><span>□</span>Media library <em>{media.length}</em></button>
        <button className={view === "enquiries" ? "active" : ""} onClick={() => setView("enquiries")}><span>✉</span>Enquiries <em>{newEnquiries}</em></button>
      </nav>
      <div className="admin-sidebar-foot"><div className="admin-avatar">AD</div><div><strong>{email}</strong><button onClick={logout}>Sign out</button></div></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><span>Divine collection</span><h1>{title}</h1></div><div><Link href="/properties" target="_blank">View live collection ↗</Link><button className="admin-primary" onClick={openCreate}><span>＋</span>Add property</button></div></header>
      {notice && <div className="admin-notice"><span>✓</span>{notice}</div>}
      {error && <div className="admin-notice admin-notice-error"><span>!</span>{error}<button onClick={() => setError("")}>×</button></div>}

      {view === "overview" && <>
        <div className="admin-stats"><article><span>Live properties</span><strong>{publishedCount.toString().padStart(2, "0")}</strong><small>Visible on website</small></article><article><span>New enquiries</span><strong>{newEnquiries.toString().padStart(2, "0")}</strong><small>Awaiting a response</small></article><article><span>Featured</span><strong>{featuredCount.toString().padStart(2, "0")}</strong><small>Homepage priority</small></article><article className="admin-stat-accent"><span>Backend status</span><strong>{loading ? "Syncing" : "Live"}</strong><small>MongoDB data · Server media</small></article></div>
        <PropertyTable items={filtered.slice(0, 6)} loading={loading} search={search} setSearch={setSearch} openEdit={openEdit} duplicate={duplicateProperty} remove={removeProperty} heading="Recent catalogue" />
      </>}

      {view === "properties" && <PropertyTable items={filtered} loading={loading} search={search} setSearch={setSearch} openEdit={openEdit} duplicate={duplicateProperty} remove={removeProperty} heading="All properties" />}

      {view === "media" && <MediaLibrary media={media} uploading={uploading === "library"} onUpload={(files) => uploadFiles(files, "library")} onDelete={removeMedia} />}

      {view === "enquiries" && <EnquiryInbox items={enquiries} onStatus={setEnquiryStatus} onDelete={removeEnquiry} />}
    </section>

    {editorOpen && <PropertyEditor property={draft} editing={Boolean(editingSlug)} section={editorSection} setSection={setEditorSection} previewMode={previewMode} setPreviewMode={setPreviewMode} amenitiesText={amenitiesText} setAmenitiesText={setAmenitiesText} highlightsText={highlightsText} setHighlightsText={setHighlightsText} saving={saving} uploading={uploading} error={error} update={update} onUpload={uploadFiles} onSubmit={saveProperty} onClose={() => setEditorOpen(false)} />}
  </main>;
}

function PropertyTable({ items, loading, search, setSearch, openEdit, duplicate, remove, heading }: { items: Property[]; loading: boolean; search: string; setSearch: (value: string) => void; openEdit: (property: Property, preview?: boolean) => void; duplicate: (property: Property) => void; remove: (property: Property) => void; heading: string }) {
  return <><div className="admin-collection-head"><div><span>Catalogue</span><h2>{heading}</h2></div><label><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search residences" /></label></div><div className="admin-table"><div className="admin-table-head"><span>Residence</span><span>Location</span><span>Value</span><span>Status</span><span /></div>{loading ? <div className="admin-table-empty">Loading your collection...</div> : items.length ? items.map((property) => <article key={property.slug}><div className="admin-property-name"><img src={mediaUrl(property.image)} alt="" /><div><strong>{property.name}</strong><span>{property.developer} · {property.type}</span></div></div><span>{property.location}</span><span>{property.price}</span><span><i className={property.published === false ? "draft" : "published"} />{property.published === false ? "Draft" : "Published"}</span><div className="admin-row-actions"><button onClick={() => openEdit(property)}>Edit</button><button onClick={() => openEdit(property, true)}>Preview</button><details><summary aria-label={`More actions for ${property.name}`}>•••</summary><div><button onClick={() => duplicate(property)}>Duplicate</button><button className="danger" onClick={() => remove(property)}>Delete</button></div></details></div></article>) : <div className="admin-table-empty"><span>◇</span><h3>Your collection is ready to be curated.</h3><p>Add the first property and preview its presentation before publishing.</p></div>}</div></>;
}

function EnquiryInbox({ items, onStatus, onDelete }: { items: Enquiry[]; onStatus: (enquiry: Enquiry, status: Enquiry["status"]) => void; onDelete: (enquiry: Enquiry) => void }) {
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | Enquiry["status"]>("all");
  const filtered = items.filter((item) => {
    const matchesStatus = status === "all" || item.status === status;
    const haystack = `${item.name} ${item.email} ${item.phone} ${item.interest} ${item.propertyName || ""} ${item.message}`.toLowerCase();
    return matchesStatus && haystack.includes(search.toLowerCase());
  });
  const selected = filtered.find((item) => item.id === selectedId) || filtered[0];
  const formattedDate = selected ? new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(selected.createdAt)) : "";

  return <section className="admin-enquiries"><div className="admin-enquiry-toolbar"><div><span>Private client inbox</span><h2>Every conversation, in one place.</h2></div><label><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search enquiries" /></label></div><div className="admin-enquiry-filters">{(["all", "new", "contacted", "resolved"] as const).map((item) => <button type="button" key={item} className={status === item ? "active" : ""} onClick={() => setStatus(item)}>{item}<em>{item === "all" ? items.length : items.filter((enquiry) => enquiry.status === item).length}</em></button>)}</div>{filtered.length ? <div className="admin-enquiry-workspace"><div className="admin-enquiry-list">{filtered.map((enquiry) => <button type="button" key={enquiry.id} className={selected?.id === enquiry.id ? "active" : ""} onClick={() => setSelectedId(enquiry.id)}><span className={`admin-enquiry-dot ${enquiry.status}`} /><div><strong>{enquiry.name}</strong><span>{enquiry.propertyName || enquiry.interest || "General enquiry"}</span><p>{enquiry.message || "No additional message supplied."}</p></div><time>{new Date(enquiry.createdAt).toLocaleDateString("en-AE", { day: "2-digit", month: "short" })}</time></button>)}</div>{selected && <article className="admin-enquiry-detail"><header><div><span className={`admin-enquiry-status ${selected.status}`}>{selected.status}</span><small>{formattedDate}</small></div><h3>{selected.name}</h3><p>{selected.propertyName ? `Enquiry for ${selected.propertyName}` : selected.interest || "Private property enquiry"}</p></header><div className="admin-enquiry-contact"><a href={`mailto:${selected.email}`}><span>Email</span><strong>{selected.email}</strong></a><a href={`tel:${selected.phone}`}><span>Telephone</span><strong>{selected.phone}</strong></a><div><span>Source</span><strong>{selected.source}</strong></div><div><span>Interest</span><strong>{selected.interest || "Not specified"}</strong></div></div><div className="admin-enquiry-message"><span>Client message</span><p>{selected.message || "No additional message supplied."}</p></div><footer><a className="admin-secondary" href={`mailto:${selected.email}`}>Reply by email</a><a className="admin-secondary" href={`tel:${selected.phone}`}>Call client</a>{selected.status !== "contacted" && <button className="admin-primary" type="button" onClick={() => onStatus(selected, "contacted")}>Mark contacted</button>}{selected.status !== "resolved" && <button className="admin-primary" type="button" onClick={() => onStatus(selected, "resolved")}>Resolve</button>}<button className="admin-danger" type="button" onClick={() => onDelete(selected)}>Delete</button></footer></article>}</div> : <div className="admin-enquiry-empty"><span>✉</span><h3>No enquiries here.</h3><p>New contact and property enquiries will appear automatically.</p></div>}</section>;
}

function MediaLibrary({ media, uploading, onUpload, onDelete }: { media: UploadedMedia[]; uploading: boolean; onUpload: (files: FileList) => void; onDelete: (item: UploadedMedia) => void }) {
  return <section className="admin-media-view"><div className="admin-media-intro"><div><span>Central asset library</span><h2>Images, films & brochures</h2><p>Upload once, then reuse each asset across property listings. Films must be MP4 or WebM.</p></div><UploadButton accept="image/*,video/mp4,video/webm,.mp4,.webm,application/pdf" multiple busy={uploading} label="Upload media" onFiles={onUpload} /></div><div className="admin-media-grid">{media.length ? media.map((item) => <article key={item.url}>{item.type === "image" ? <img src={mediaUrl(item.url)} alt={item.name} /> : item.type === "video" ? <video src={mediaUrl(item.url)} muted controls playsInline preload="metadata" /> : <div className="admin-document-tile"><span>PDF</span></div>}<div><strong>{item.name}</strong><span>{item.type} · {(item.size / 1024 / 1024).toFixed(1)} MB</span><div className="admin-media-actions"><button onClick={() => navigator.clipboard.writeText(item.url)}>Copy path</button><button className="danger" onClick={() => onDelete(item)}>Delete</button></div></div></article>) : <div className="admin-media-empty"><span>□</span><h3>Your media library is empty.</h3><p>Upload professional photography, property films and PDF brochures.</p></div>}</div></section>;
}

function PropertyEditor({ property, editing, section, setSection, previewMode, setPreviewMode, amenitiesText, setAmenitiesText, highlightsText, setHighlightsText, saving, uploading, error, update, onUpload, onSubmit, onClose }: { property: Property; editing: boolean; section: EditorSection; setSection: (value: EditorSection) => void; previewMode: "card" | "page"; setPreviewMode: (value: "card" | "page") => void; amenitiesText: string; setAmenitiesText: (value: string) => void; highlightsText: string; setHighlightsText: (value: string) => void; saving: boolean; uploading: UploadTarget | null; error: string; update: <K extends keyof Property>(key: K, value: Property[K]) => void; onUpload: (files: FileList | File[], target: UploadTarget) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
  return <div className="admin-editor-backdrop"><section className="admin-editor admin-editor-wide">
    <header><div><span>{editing ? "Edit residence" : "New residence"}</span><h2>{property.name || "Add to collection"}</h2></div><div className="admin-editor-header-actions"><button type="button" onClick={onClose} aria-label="Close editor">×</button></div></header>
    <div className="admin-editor-workspace">
      <form onSubmit={onSubmit}>
        <nav className="admin-editor-tabs">{(["details", "media", "location", "seo"] as EditorSection[]).map((item) => <button key={item} type="button" className={section === item ? "active" : ""} onClick={() => setSection(item)}>{item}</button>)}</nav>
        {error && <div className="admin-form-error">{error}</div>}
        {section === "details" && <div className="admin-form-pane"><SectionHeading number="01" title="Identity & story" copy="Everything clients read about the residence." /><div className="admin-form-fields"><Field label="Property name" full><input required value={property.name} onChange={(event) => { update("name", event.target.value); if (!editing) update("slug", slugify(event.target.value)); }} /></Field><Field label="URL slug"><input required value={property.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></Field><Field label="Status label"><input value={property.statusLabel || ""} onChange={(event) => update("statusLabel", event.target.value)} placeholder="New release" /></Field><Field label="Property type"><input required value={property.type} onChange={(event) => update("type", event.target.value)} /></Field><Field label="Developer"><input required value={property.developer} onChange={(event) => update("developer", event.target.value)} /></Field><Field label="Location"><input required value={property.location} onChange={(event) => update("location", event.target.value)} /></Field><Field label="Price"><input required value={property.price} onChange={(event) => update("price", event.target.value)} placeholder="AED 12.8M" /></Field><Field label="Bedrooms"><input required value={property.bedrooms} onChange={(event) => update("bedrooms", event.target.value)} /></Field><Field label="Residence size"><input required value={property.area} onChange={(event) => update("area", event.target.value)} /></Field><Field label="Completion"><input required value={property.completion} onChange={(event) => update("completion", event.target.value)} /></Field><Field label="Editorial headline" full><input value={property.tagline || ""} onChange={(event) => update("tagline", event.target.value)} placeholder="Architecture in service of a remarkable life." /></Field><Field label="Overview" full><textarea required rows={5} value={property.description} onChange={(event) => update("description", event.target.value)} /></Field><Field label="Supporting paragraph" full><textarea rows={4} value={property.secondaryDescription || ""} onChange={(event) => update("secondaryDescription", event.target.value)} /></Field><Field label="Amenities · one per line" full><textarea rows={6} value={amenitiesText} onChange={(event) => setAmenitiesText(event.target.value)} /></Field></div></div>}
        {section === "media" && <div className="admin-form-pane"><SectionHeading number="02" title="Media presentation" copy="Upload photography, film, plans and brochures." /><MediaDrop title="Cover image" copy="Landscape photography works best." accept="image/*" busy={uploading === "cover"} onFiles={(files) => onUpload(files, "cover")} />{property.image && <div className="admin-cover-current"><img src={mediaUrl(property.image)} alt="Current cover" /><span>Current cover</span></div>}<MediaDrop title="Gallery" copy="Select multiple images. Drag-and-drop is supported." accept="image/*" multiple busy={uploading === "gallery"} onFiles={(files) => onUpload(files, "gallery")} /><div className="admin-gallery-manager">{(property.gallery || []).map((image, index) => <figure key={`${image}-${index}`}><img src={mediaUrl(image)} alt="" /><div><button type="button" onClick={() => update("image", image)}>Set cover</button><button type="button" onClick={() => update("gallery", (property.gallery || []).filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div></figure>)}</div><MediaDrop title="Property film" copy="MP4 or WebM up to 250MB. Publish changes after the upload finishes." accept="video/mp4,video/webm,.mp4,.webm" busy={uploading === "video"} onFiles={(files) => onUpload(files, "video")} />{property.video && <div className="admin-video-current"><video src={mediaUrl(property.video)} controls playsInline preload="metadata" /><code>{property.video}</code><button type="button" onClick={() => update("video", "")}>Remove film</button></div>}<MediaDrop title="Floor plans" copy="Upload one or more clear plan images." accept="image/*" multiple busy={uploading === "floorPlans"} onFiles={(files) => onUpload(files, "floorPlans")} /><div className="admin-gallery-manager floorplans">{(property.floorPlans || []).map((image, index) => <figure key={`${image}-${index}`}><img src={mediaUrl(image)} alt="" /><div><button type="button" onClick={() => update("floorPlans", (property.floorPlans || []).filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div></figure>)}</div><MediaDrop title="PDF brochure" copy="Attach the official property brochure." accept="application/pdf" busy={uploading === "brochure"} onFiles={(files) => onUpload(files, "brochure")} />{property.brochure && <div className="admin-file-current"><span>PDF</span><code>{property.brochure}</code><button type="button" onClick={() => update("brochure", "")}>Remove</button></div>}</div>}
        {section === "location" && <div className="admin-form-pane"><SectionHeading number="03" title="Location story" copy="Control the map and neighbourhood narrative." /><div className="admin-form-fields"><Field label="Map search query" full><input value={property.mapQuery || ""} onChange={(event) => update("mapQuery", event.target.value)} placeholder="Dubai Hills Estate, Dubai" /></Field><Field label="Google Maps embed URL or iframe code" full><textarea rows={4} value={property.mapEmbedUrl || ""} onChange={(event) => update("mapEmbedUrl", event.target.value)} placeholder={'https://www.google.com/maps/embed?pb=...'} /><small className="admin-field-help">In Google Maps choose Share → Embed a map, then paste either the URL or the complete iframe code.</small></Field><Field label="Location description" full><textarea rows={5} value={property.locationDescription || ""} onChange={(event) => update("locationDescription", event.target.value)} /></Field><Field label="Travel highlights · one per line" full><textarea rows={6} value={highlightsText} onChange={(event) => setHighlightsText(event.target.value)} placeholder={"12 min · Downtown Dubai\n18 min · Dubai International Airport"} /></Field></div></div>}
        {section === "seo" && <div className="admin-form-pane"><SectionHeading number="04" title="Publishing & search" copy="Decide where the property appears and how it is described." /><div className="admin-form-fields"><Field label="SEO page title" full><input value={property.seoTitle || ""} onChange={(event) => update("seoTitle", event.target.value)} placeholder={`${property.name || "Property"} | Divine Luxury Properties`} /></Field><Field label="SEO description" full><textarea rows={4} value={property.seoDescription || ""} onChange={(event) => update("seoDescription", event.target.value)} maxLength={170} /></Field></div><label className="admin-publish-toggle"><input type="checkbox" checked={Boolean(property.featured)} onChange={(event) => update("featured", event.target.checked)} /><span><i />Feature on the homepage</span><small>Featured properties receive priority in the selected portfolio.</small></label><label className="admin-publish-toggle"><input type="checkbox" checked={property.published !== false} onChange={(event) => update("published", event.target.checked)} /><span><i />Publish this residence</span><small>Turn this off to keep the listing private while you refine it.</small></label></div>}
        <footer><button type="button" className="admin-secondary" onClick={onClose}>Cancel</button><button className="admin-primary" type="submit" disabled={saving || Boolean(uploading)}>{saving ? "Saving changes..." : property.published === false ? "Save draft" : editing ? "Publish changes" : "Publish property"}</button></footer>
      </form>
      <PropertyPreview property={{ ...property, amenities: lines(amenitiesText), locationHighlights: lines(highlightsText) }} mode={previewMode} setMode={setPreviewMode} />
    </div>
  </section></div>;
}

function PropertyPreview({ property, mode, setMode }: { property: Property; mode: "card" | "page"; setMode: (value: "card" | "page") => void }) {
  const cover = mediaUrl(property.image) || "/images/hero-villa.jpg";
  const mapSource = googleMapEmbedUrl(property.mapEmbedUrl, property.mapQuery || property.location || "Dubai");
  return <aside className="admin-live-preview"><header><div><span>Live preview</span><strong>{mode === "page" ? "Property page" : "Listing card"}</strong></div><div><button type="button" className={mode === "card" ? "active" : ""} onClick={() => setMode("card")}>Card</button><button type="button" className={mode === "page" ? "active" : ""} onClick={() => setMode("page")}>Page</button></div></header><div className="admin-preview-canvas">{mode === "card" ? <article className="admin-preview-card"><div style={{ backgroundImage: `url(${cover})` }}><span>{property.statusLabel || "New release"}</span></div><small>{property.location || "Location"}</small><h3>{property.name || "Property name"}</h3><p>{property.type || "Residence"} · {property.bedrooms || "Configuration"}</p><strong>From {property.price || "Price on request"}</strong></article> : <article className="admin-preview-page"><div className="admin-preview-hero" style={{ backgroundImage: `linear-gradient(0deg, rgba(5,5,4,.72), rgba(5,5,4,.05)), url(${cover})` }}>{property.video && <video src={mediaUrl(property.video)} autoPlay muted loop controls playsInline preload="metadata" />}<div><span>{property.developer || "Developer"} · {property.type || "Residence"}</span><h3>{property.name || "Property name"}</h3><p>{property.location || "Location"} <strong>From {property.price || "Price on request"}</strong></p></div></div><div className="admin-preview-facts"><span>{property.bedrooms || "Configuration"}</span><span>{property.area || "Residence size"}</span><span>{property.completion || "Completion"}</span></div><div className="admin-preview-story"><small>The residence</small><h4>{property.tagline || "Architecture in service of a remarkable life."}</h4><p>{property.description || "Your property overview will appear here as you type."}</p></div><div className="admin-preview-amenities"><small>Amenities</small>{property.amenities.slice(0, 4).map((item, index) => <span key={item}>{String(index + 1).padStart(2, "0")} {item}</span>)}</div><iframe className="admin-preview-map" title="Map preview" src={mapSource} loading="lazy" /></article>}</div></aside>;
}

function UploadButton({ accept, multiple = false, busy, label, onFiles }: { accept: string; multiple?: boolean; busy: boolean; label: string; onFiles: (files: FileList) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return <><button className="admin-primary" type="button" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Uploading..." : label}</button><input ref={input} hidden type="file" accept={accept} multiple={multiple} onChange={(event) => { if (event.target.files?.length) onFiles(event.target.files); event.target.value = ""; }} /></>;
}

function MediaDrop({ title, copy, accept, multiple = false, busy, onFiles }: { title: string; copy: string; accept: string; multiple?: boolean; busy: boolean; onFiles: (files: FileList) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return <button type="button" className={`admin-media-drop ${busy ? "busy" : ""}`} onClick={() => input.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files); }}><input ref={input} hidden type="file" accept={accept} multiple={multiple} onChange={(event) => { if (event.target.files?.length) onFiles(event.target.files); event.target.value = ""; }} /><span>{busy ? "Uploading" : "＋"}</span><strong>{title}</strong><small>{busy ? "Please keep this editor open." : copy}</small></button>;
}

function SectionHeading({ number, title, copy }: { number: string; title: string; copy: string }) {
  return <div className="admin-form-pane-heading"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></div>;
}

function Field({ label, full = false, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return <label className={full ? "full" : ""}><span>{label}</span>{children}</label>;
}

function AdminLogin({ email, password, error, onEmail, onPassword, onSubmit }: { email: string; password: string; error: string; onEmail: (value: string) => void; onPassword: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <main className="admin-login"><div className="admin-login-image"><Link href="/" className="admin-brand"><span className="brand-mark admin-brand-mark" aria-hidden="true" /><div><strong>DIVINE</strong><span>PROPERTY STUDIO</span></div></Link><div><span className="eyebrow light">Private administration</span><h1>Curate the<br /><em>exceptional.</em></h1><p>A composed workspace for every image, film and residence in your collection.</p></div><small>Local Node.js Property Studio</small></div><div className="admin-login-panel"><form onSubmit={onSubmit}><span className="admin-kicker">Secure local access</span><h2>Welcome back.</h2><p>Sign in to manage properties and upload media.</p>{error && <div className="admin-auth-error">{error}</div>}<label><span>Email address</span><input type="email" autoComplete="email" required value={email} onChange={(event) => onEmail(event.target.value)} /></label><label><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => onPassword(event.target.value)} placeholder="Admin password" /></label><button className="admin-login-button" type="submit">Enter Property Studio <span>↗</span></button><Link href="/">← Return to the website</Link></form></div></main>;
}
