// Type definitions only. There is deliberately NO business content in
// this file — no hardcoded services, products, phone numbers, or
// addresses. All of that comes exclusively from the Strapi CMS via
// lib/cms.ts. If the CMS is unreachable, misconfigured, or returns no
// data, the site shows an empty/unavailable state rather than silently
// falling back to placeholder content — so a broken CMS connection is
// visible, not masked.

export interface DeliveryZone {
  label: string;
  fee: number;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  geo: { lat: number; lng: number };
  hoursSpec: string;
  hoursDisplay: string;
  priceRange: string;
  social: { facebook: string; instagram: string };
  mapQuery: string;
  deliveryZones: DeliveryZone[];
  freePickup: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

export interface Testimonial {
  name: string;
  location: string;
  initials: string;
  quote: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: string;
  car: string;
  service: string;
}

export interface CarTypeOption {
  label: string;
  price: number;
}

export interface MaterialOption {
  label: string;
  priceAdd: number;
  description: string;
}

export interface ColorOption {
  label: string;
  hex: string;
}

export interface StitchingOption {
  label: string;
  hex: string | null;
}

export interface SeatCoverConfig {
  title: string;
  description: string;
  turnaroundNote: string;
  carTypes: CarTypeOption[];
  materials: MaterialOption[];
  colors: ColorOption[];
  stitchingOptions: StitchingOption[];
}

// The production domain this site is deployed at. This is a deployment
// constant (needed for canonical URLs, the sitemap, and JSON-LD @id
// fields) — not business content, so it deliberately does NOT come from
// the CMS. Update this once when you deploy.
export const SITE_URL = "https://www.carposhish.pk";
