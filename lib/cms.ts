import {
  siteConfig,
  services as fallbackServices,
  products as fallbackProducts,
  testimonials as fallbackTestimonials,
  faqs as fallbackFaqs,
  galleryItems as fallbackGalleryItems,
  type SiteSettings,
  type Service,
  type Product,
  type Testimonial,
  type Faq,
  type GalleryItem,
} from "./site-config";

// --- Strapi response shapes (v4 REST API envelope) ---------------------

interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

interface StrapiCollectionResponse<T> {
  data: StrapiEntity<T>[];
}

interface StrapiSingleResponse<T> {
  data: StrapiEntity<T> | null;
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
}

// --- Fetch helper --------------------------------------------------------

/**
 * Fetches from Strapi and returns the parsed JSON, or `null` if:
 * - STRAPI_URL isn't set (CMS not configured yet — expected during initial
 *   setup, not an error)
 * - the request fails (CMS not running, network issue)
 * - Strapi returns a non-2xx response (e.g. permissions not open yet)
 *
 * Every getX() function below treats `null` as "use the fallback content",
 * so the website always renders correctly whether or not the CMS is up.
 *
 * In development, every fallback is logged to the terminal with the
 * reason — if content you edited in Strapi isn't showing up on the site,
 * check this server log first rather than guessing why.
 */
async function strapiFetch<T>(path: string): Promise<T | null> {
  const base = process.env.STRAPI_URL;
  if (!base) {
    devLog(`STRAPI_URL is not set — using fallback data for ${path}`);
    return null;
  }

  try {
    const headers: HeadersInit = {};
    if (process.env.STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }

    const res = await fetch(`${base}${path}`, {
      headers,
      // ISR: re-fetch from Strapi at most once a minute rather than on
      // every request, while still picking up CMS edits without a redeploy.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      devLog(
        `Strapi responded ${res.status} for ${base}${path} — using fallback data. ` +
          `(A common cause: the entry exists but isn't Published yet.)`
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    devLog(
      `Could not reach Strapi at ${base}${path} — using fallback data. ` +
        `Is "npm run develop" running in car-poshish-cms? (${(err as Error).message})`
    );
    return null;
  }
}

function devLog(message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[cms] ${message}`);
  }
}

// --- Public getters --------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const json = await strapiFetch<StrapiSingleResponse<StrapiSiteSettingAttrs>>(
    "/api/site-setting"
  );
  const attrs = json?.data?.attributes;
  if (!attrs) return siteConfig;

  return {
    ...siteConfig,
    name: attrs.businessName ?? siteConfig.name,
    tagline: attrs.tagline ?? siteConfig.tagline,
    description: attrs.description ?? siteConfig.description,
    phone: attrs.phone ?? siteConfig.phone,
    phoneDisplay: attrs.phoneDisplay ?? siteConfig.phoneDisplay,
    whatsapp: attrs.whatsapp ?? siteConfig.whatsapp,
    email: attrs.email ?? siteConfig.email,
    address: {
      street: attrs.addressStreet ?? siteConfig.address.street,
      city: attrs.addressCity ?? siteConfig.address.city,
      region: attrs.addressRegion ?? siteConfig.address.region,
      postalCode: attrs.addressPostalCode ?? siteConfig.address.postalCode,
      country: attrs.addressCountry ?? siteConfig.address.country,
    },
    geo: {
      lat: attrs.geoLat ?? siteConfig.geo.lat,
      lng: attrs.geoLng ?? siteConfig.geo.lng,
    },
    hoursSpec: attrs.hoursSpec ?? siteConfig.hoursSpec,
    hoursDisplay: attrs.hoursDisplay ?? siteConfig.hoursDisplay,
    priceRange: attrs.priceRange ?? siteConfig.priceRange,
    social: {
      facebook: attrs.facebookUrl ?? siteConfig.social.facebook,
      instagram: attrs.instagramUrl ?? siteConfig.social.instagram,
    },
    mapQuery: attrs.mapQuery ?? siteConfig.mapQuery,
  };
}

export async function getServices(): Promise<Service[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiServiceAttrs>>(
    "/api/services?sort=order:asc"
  );
  if (!json?.data?.length) return fallbackServices;

  return json.data.map((entry) => ({
    id: entry.attributes.slug || String(entry.id),
    name: entry.attributes.name,
    description: entry.attributes.description,
    price: entry.attributes.price,
    icon: entry.attributes.icon,
  }));
}

export async function getProducts(): Promise<Product[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiProductAttrs>>(
    "/api/products?sort=order:asc"
  );
  if (!json?.data?.length) return fallbackProducts;

  return json.data.map((entry) => ({
    id: entry.attributes.slug || String(entry.id),
    name: entry.attributes.name,
    description: entry.attributes.description,
    price: entry.attributes.price,
    icon: entry.attributes.icon,
    category: entry.attributes.category,
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiTestimonialAttrs>>(
    "/api/testimonials?sort=order:asc"
  );
  if (!json?.data?.length) return fallbackTestimonials;

  return json.data.map((entry) => ({
    name: entry.attributes.customerName,
    location: entry.attributes.location ?? "",
    initials: initialsFrom(entry.attributes.customerName),
    quote: entry.attributes.quote,
  }));
}

export async function getFaqs(): Promise<Faq[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiFaqAttrs>>(
    "/api/faqs?sort=order:asc"
  );
  if (!json?.data?.length) return fallbackFaqs;

  return json.data.map((entry) => ({
    question: entry.attributes.question,
    answer: entry.attributes.answer,
  }));
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const json = await strapiFetch<StrapiCollectionResponse<StrapiGalleryItemAttrs>>(
    "/api/gallery-items?sort=order:asc"
  );
  if (!json?.data?.length) return fallbackGalleryItems;

  return json.data.map((entry) => ({
    id: String(entry.id),
    car: entry.attributes.carModel,
    service: entry.attributes.serviceLabel,
  }));
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}
