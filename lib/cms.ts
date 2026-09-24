import type {
  SiteSettings,
  Service,
  Product,
  Testimonial,
  Faq,
  GalleryItem,
  SeatCoverConfig,
} from "./site-config";

// --- Strapi response shapes ------------------------------------------------
//
// Strapi 5 flattened format: an entry comes back as
// `{ id, documentId, name, price, ... }` — no `attributes` wrapper.

interface StrapiEntity {
  id: number;
  documentId: string;
}

type StrapiEntry<T> = StrapiEntity & T;

interface StrapiCollectionResponse<T> {
  data: StrapiEntry<T>[];
}

interface StrapiSingleResponse<T> {
  data: StrapiEntry<T> | null;
}

interface StrapiServiceAttrs {
  name: string;
  slug: string;
  description: string;
  price: number;
  icon: string;
}

interface StrapiProductAttrs {
  name: string;
  slug: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

interface StrapiTestimonialAttrs {
  customerName: string;
  location: string | null;
  quote: string;
  rating: number;
}

interface StrapiFaqAttrs {
  question: string;
  answer: string;
}

interface StrapiGalleryItemAttrs {
  carModel: string;
  serviceLabel: string;
}

interface StrapiSeatCoverConfigAttrs {
  title: string | null;
  description: string | null;
  turnaroundNote: string | null;
  carTypes: { label: string; price: number }[] | null;
  materials: { label: string; priceAdd: number; description: string }[] | null;
  colors: { label: string; hex: string }[] | null;
  stitchingOptions: { label: string; hex: string | null }[] | null;
}

interface StrapiSiteSettingAttrs {
  businessName: string | null;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  phoneDisplay: string | null;
  whatsapp: string | null;
  email: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  addressRegion: string | null;
  addressPostalCode: string | null;
  addressCountry: string | null;
  geoLat: number | null;
  geoLng: number | null;
  mapQuery: string | null;
  hoursDisplay: string | null;
  hoursSpec: string | null;
  priceRange: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  deliveryZones: { label: string; fee: number }[] | null;
  freePickup: boolean | null;
}

// --- Fetch helper --------------------------------------------------------

// Every CMS fetch shares this tag so a single revalidateTag() call (see
// app/api/revalidate/route.ts) can invalidate all of it at once when the
// CMS pings us that something changed — see "Instant CMS updates" in the
// README. The 60s revalidate window is a backstop for when that ping
// doesn't happen (CMS down, env vars not set, etc.) — it does NOT mean
// stale/placeholder data gets shown; it just controls how quickly a
// genuinely CMS-down state is re-checked.
const CMS_CACHE_TAG = "cms-content";

/**
 * Fetches from Strapi and returns the parsed JSON, or `null` if:
 * - STRAPI_URL isn't set
 * - the request fails (CMS not running, network issue)
 * - Strapi returns a non-2xx response (e.g. permissions not open yet)
 *
 * There is no fallback content anywhere in this file. Every getX()
 * function below returns an empty array (collections) or `null` (site
 * settings) when this happens — callers are expected to render an
 * explicit "unavailable" state, not substitute placeholder data. Check
 * this server's terminal for a `[cms]` warning whenever that happens; it
 * always states the specific reason.
 */
async function strapiFetch<T>(path: string): Promise<T | null> {
  const base = process.env.STRAPI_URL;
  if (!base) {
    devLog(`STRAPI_URL is not set — no content will be loaded for ${path}`);
    return null;
  }

  try {
    const headers: HeadersInit = {};
    if (process.env.STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }

    const res = await fetch(`${base}${path}`, {
      headers,
      next: {
        revalidate: 60,
        tags: [CMS_CACHE_TAG],
      },
    });

    if (!res.ok) {
      devLog(
        `Strapi responded ${res.status} for ${base}${path} — no content loaded. ` +
          `(A common cause: the entry exists but isn't Published yet, or ` +
          `Public permissions for this content type were removed.)`
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    devLog(
      `Could not reach Strapi at ${base}${path} — no content loaded. ` +
        `Is "npm run develop" running in car-poshish-cms? (${(err as Error).message})`
    );
    return null;
  }
}

function devLog(message: string) {
  // Intentionally logs in all environments, not just development — if
  // the CMS is unreachable in production, that's exactly when you most
  // need to see this in your host's server logs.
  console.warn(`[cms] ${message}`);
}

// --- Public getters --------------------------------------------------------

/** Returns `null` if Site Settings can't be loaded from the CMS. */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const json = await strapiFetch<StrapiSingleResponse<StrapiSiteSettingAttrs>>(
    "/api/site-setting"
  );
  const entry = json?.data;
  if (!entry) return null;

  return {
    name: entry.businessName ?? "",
    tagline: entry.tagline ?? "",
    description: entry.description ?? "",
    phone: entry.phone ?? "",
    phoneDisplay: entry.phoneDisplay ?? "",
    whatsapp: entry.whatsapp ?? "",
    email: entry.email ?? "",
    address: {
      street: entry.addressStreet ?? "",
      city: entry.addressCity ?? "",
      region: entry.addressRegion ?? "",
      postalCode: entry.addressPostalCode ?? "",
      country: entry.addressCountry ?? "",
    },
    geo: {
      lat: entry.geoLat ?? 0,
      lng: entry.geoLng ?? 0,
    },
    hoursSpec: entry.hoursSpec ?? "",
    hoursDisplay: entry.hoursDisplay ?? "",
    priceRange: entry.priceRange ?? "",
    social: {
      facebook: entry.facebookUrl ?? "",
      instagram: entry.instagramUrl ?? "",
    },
    mapQuery: entry.mapQuery ?? "",
    deliveryZones: entry.deliveryZones ?? [],
    freePickup: entry.freePickup ?? true,
  };
}

/** Returns `[]` if services can't be loaded from the CMS. */
/** Returns `null` if the seat cover configurator's options can't be loaded. */
export async function getSeatCoverConfig(): Promise<SeatCoverConfig | null> {
  const json = await strapiFetch<StrapiSingleResponse<StrapiSeatCoverConfigAttrs>>(
    "/api/seat-cover-config"
  );
  const entry = json?.data;
  if (!entry) return null;
  if (!entry.carTypes?.length || !entry.materials?.length || !entry.colors?.length) {
    return null;
  }

  return {
    title: entry.title ?? "Custom Seat Covers",
    description: entry.description ?? "",
    turnaroundNote: entry.turnaroundNote ?? "",
    carTypes: entry.carTypes,
    materials: entry.materials,
    colors: entry.colors,
    stitchingOptions: entry.stitchingOptions ?? [],
  };
}

export async function getServices(): Promise<Service[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiServiceAttrs>>(
    "/api/services?sort=order:asc"
  );
  if (!json?.data) return [];

  return json.data.map((entry) => ({
    id: entry.slug || String(entry.id),
    name: entry.name,
    description: entry.description,
    price: entry.price,
    icon: entry.icon,
  }));
}

/** Returns `[]` if products can't be loaded from the CMS. */
export async function getProducts(): Promise<Product[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiProductAttrs>>(
    "/api/products?sort=order:asc"
  );
  if (!json?.data) return [];

  return json.data.map((entry) => ({
    id: entry.slug || String(entry.id),
    name: entry.name,
    description: entry.description,
    price: entry.price,
    icon: entry.icon,
    category: entry.category,
  }));
}

/** Returns `[]` if testimonials can't be loaded from the CMS. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiTestimonialAttrs>>(
    "/api/testimonials?sort=order:asc"
  );
  if (!json?.data) return [];

  return json.data.map((entry) => ({
    name: entry.customerName,
    location: entry.location ?? "",
    initials: initialsFrom(entry.customerName),
    quote: entry.quote,
  }));
}

/** Returns `[]` if FAQs can't be loaded from the CMS. */
export async function getFaqs(): Promise<Faq[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiFaqAttrs>>(
    "/api/faqs?sort=order:asc"
  );
  if (!json?.data) return [];

  return json.data.map((entry) => ({
    question: entry.question,
    answer: entry.answer,
  }));
}

/** Returns `[]` if gallery items can't be loaded from the CMS. */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiGalleryItemAttrs>>(
    "/api/gallery-items?sort=order:asc"
  );
  if (!json?.data) return [];

  return json.data.map((entry) => ({
    id: String(entry.id),
    car: entry.carModel,
    service: entry.serviceLabel,
  }));
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}
