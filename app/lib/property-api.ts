import type { Property } from "../data";

export const PROPERTY_API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
export const ADMIN_TOKEN_KEY = "divine-property-studio-token";

export type UploadedMedia = {
  name: string;
  url: string;
  type: "image" | "video" | "document";
  mimeType?: string;
  size: number;
  createdAt?: string;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  propertyName?: string;
  source: string;
  status: "new" | "contacted" | "resolved";
  createdAt: string;
  updatedAt: string;
};

export function mediaUrl(value?: string) {
  if (!value) return "";
  if (value.startsWith("/uploads/")) return `${PROPERTY_API_URL}${value}`;
  return value;
}

export function googleMapEmbedUrl(value?: string, fallbackQuery = "Dubai") {
  const raw = String(value || "").trim();
  const iframeSource = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1];
  const candidate = (iframeSource || raw).replace(/&amp;/g, "&");
  if (candidate) {
    try {
      const parsed = new URL(candidate);
      const googleHost = /(^|\.)google\.[a-z.]+$/i.test(parsed.hostname) || parsed.hostname === "maps.google.com";
      if (parsed.protocol === "https:" && googleHost && parsed.pathname.includes("/maps")) return parsed.toString();
    } catch {}
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&output=embed`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.status === 204 ? (undefined as T) : response.json();
  const payload = await response.json().catch(() => ({ error: "The local API could not complete this request." }));
  throw new Error(payload.error || "The local API could not complete this request.");
}

export async function publicProperties(signal?: AbortSignal): Promise<Property[]> {
  const response = await fetch(`${PROPERTY_API_URL}/api/properties`, { signal, cache: "no-store" });
  return parseResponse<Property[]>(response);
}

export async function publicProperty(slug: string, signal?: AbortSignal): Promise<Property> {
  const response = await fetch(`${PROPERTY_API_URL}/api/properties/${encodeURIComponent(slug)}`, { signal, cache: "no-store" });
  return parseResponse<Property>(response);
}

export async function submitEnquiry(payload: Record<string, string>) {
  const response = await fetch(`${PROPERTY_API_URL}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<{ received: true; id?: string }>(response);
}

export async function adminRequest<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const response = await fetch(`${PROPERTY_API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  return parseResponse<T>(response);
}

export function announcePropertyUpdate() {
  if (typeof window === "undefined") return;
  const channel = new BroadcastChannel("divine-property-studio");
  channel.postMessage("properties-updated");
  channel.close();
}
