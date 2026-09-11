// This file is the FALLBACK / default content — used automatically
// whenever the Strapi CMS (see the car-poshish-cms project) isn't running,
// isn't configured (no STRAPI_URL set), or a specific request to it fails.
// See lib/cms.ts for the fetch layer that prefers CMS content over this
// when it's available. This means the site always works standalone, even
// before the CMS is set up.

export interface DeliveryZone {
  label: string;
  fee: number;
}

export interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
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
  serviceArea: string;
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

export const siteConfig: SiteSettings = {
  name: "Car Poshish",
  shortName: "Car Poshish",
  tagline: "Professional Car Detailing in Lahore",
  description:
    "Car Poshish is a car detailing shop in Lahore offering exterior, interior, and full detailing services. Walk in, or call or WhatsApp ahead to skip the wait.",
  // IMPORTANT: replace with your real production domain before launch
  url: "https://www.carposhish.pk",
  phone: "+923001112223",
  phoneDisplay: "0300 111 2223",
  whatsapp: "923001112223",
  email: "info@carposhish.pk",
  address: {
    street: "Main Boulevard, Gulberg III",
    city: "Lahore",
    region: "Punjab",
    postalCode: "54000",
    country: "PK",
  },
  // Approximate Lahore coordinates — replace with your exact business location
  // (this should match the pin on your Google Business Profile for local SEO)
  geo: { lat: 31.5204, lng: 74.3587 },
  // schema.org / Google Business Profile format: Mo-Su 09:00-20:00
  hoursSpec: "Mo-Su 09:00-20:00",
  hoursDisplay: "Monday – Sunday, 9:00 AM – 8:00 PM",
  priceRange: "Rs. 800 – Rs. 8,000",
  social: {
    facebook: "https://facebook.com/carposhish",
    instagram: "https://instagram.com/carposhish",
  },
  // Used to build the embedded Google Map on the Contact page.
  // No API key needed for a basic embed — just a URL-encoded search query.
  mapQuery: "Main Boulevard Gulberg III Lahore Pakistan",
  serviceArea: "Lahore, Pakistan",
  // Flat fee per zone approximates distance-based delivery pricing without
  // needing a paid maps/distance API. Editable from Site Settings in the
  // CMS admin panel if connected — see lib/cms.ts.
  deliveryZones: [
    { label: "Gulberg / Model Town / DHA", fee: 150 },
    { label: "Other areas within Lahore", fee: 300 },
    { label: "Outside Lahore (call to confirm)", fee: 600 },
  ],
  freePickup: true,
};

export const services: Service[] = [
  {
    id: "exterior-wash-polish",
    name: "Exterior Wash & Polish",
    description:
      "Hand wash, foam clean, and polish to bring back your car's outer shine.",
    price: 1500,
    icon: "droplet",
  },
  {
    id: "interior-deep-clean",
    name: "Interior Deep Clean",
    description:
      "Vacuuming, seat & carpet shampoo, and dashboard cleaning for a fresh cabin.",
    price: 2000,
    icon: "cloth",
  },
  {
    id: "full-detailing",
    name: "Full Detailing (In & Out)",
    description:
      "Our most popular package — complete interior and exterior detailing in one visit.",
    price: 3500,
    icon: "sparkle",
  },
  {
    id: "engine-bay-cleaning",
    name: "Engine Bay Cleaning",
    description:
      "Safe, careful cleaning of your engine bay to remove dust, oil, and grime.",
    price: 1000,
    icon: "wrench",
  },
  {
    id: "headlight-restoration",
    name: "Headlight Restoration",
    description: "Restore foggy, yellowed headlights to clear, bright condition.",
    price: 800,
    icon: "bulb",
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating (Add-on)",
    description:
      "A long-lasting protective shine on top of our full detailing package.",
    price: 8000,
    icon: "shield",
  },
];

export const faqs: Faq[] = [
  {
    question: "Do I need an appointment?",
    answer:
      "Walk-ins are always welcome. If you'd like to skip the wait, call or WhatsApp us ahead of time and we'll have a bay ready for you.",
  },
  {
    question: "How long does a full detailing take?",
    answer:
      "A full interior and exterior detailing usually takes 2 to 3 hours, depending on your car's condition. Our waiting area has seating if you'd like to stay.",
  },
  {
    question: "Do I need to pay in advance?",
    answer:
      "No. You only pay after the service is complete and you're happy with the result.",
  },
  {
    question: "Where is your shop located?",
    answer:
      "We're on Main Boulevard, Gulberg III, Lahore. Call or WhatsApp us if you need directions or help finding parking.",
  },
  {
    question: "What if I'm not happy with the service?",
    answer:
      "Just tell our team on the spot — we'll fix any spots you're not satisfied with before you leave.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Ahmed Raza",
    location: "DHA, Lahore",
    initials: "AR",
    quote:
      "They came to my house in Gulberg and my car looked brand new by the time they left. Very polite team.",
  },
  {
    name: "Sana Malik",
    location: "Johar Town, Lahore",
    initials: "SM",
    quote:
      "Easiest booking ever — I just sent a WhatsApp message and they showed up on time the next day.",
  },
  {
    name: "Bilal Chaudhry",
    location: "Model Town, Lahore",
    initials: "BC",
    quote:
      "Fair pricing and no pressure to add extra services. My car's interior smells fresh again.",
  },
];

// Shop products people can buy in person or ask about over WhatsApp.
// This is a simple catalog display, not a checkout system — orders are
// still confirmed by call/WhatsApp/in-shop, matching the rest of the site's
// "no forms, no apps" approach.
export const products: Product[] = [
  {
    id: "premium-car-shampoo",
    name: "Premium Car Shampoo",
    description: "pH-balanced foam shampoo, safe on wax and ceramic coatings. 500ml bottle.",
    price: 950,
    icon: "droplet",
    category: "Cleaning",
  },
  {
    id: "microfiber-cloth-set",
    name: "Microfiber Cloth Set",
    description: "Pack of 5 lint-free microfiber towels for drying and polishing.",
    price: 700,
    icon: "cloth",
    category: "Accessories",
  },
  {
    id: "tyre-shine-gel",
    name: "Tyre Shine Gel",
    description: "Long-lasting gel that restores a deep black finish to tyres.",
    price: 650,
    icon: "tyre",
    category: "Exterior",
  },
  {
    id: "car-perfume",
    name: "Car Air Freshener",
    description: "Long-lasting vent-clip air freshener, available in 3 scents.",
    price: 350,
    icon: "sparkle",
    category: "Interior",
  },
  {
    id: "dashboard-polish",
    name: "Dashboard & Trim Polish",
    description: "Matte-finish protectant spray for dashboards, door trims, and tyres.",
    price: 800,
    icon: "spray",
    category: "Interior",
  },
  {
    id: "carnauba-wax",
    name: "Carnauba Car Wax",
    description: "Paste wax for a deep, glossy shine that lasts for weeks.",
    price: 1800,
    icon: "sparkle",
    category: "Exterior",
  },
  {
    id: "ceramic-spray-sealant",
    name: "Ceramic Spray Sealant",
    description: "Easy spray-on ceramic coating top-up for between full treatments.",
    price: 2200,
    icon: "shield",
    category: "Exterior",
  },
  {
    id: "seat-covers",
    name: "Universal Seat Covers",
    description: "Breathable, water-resistant front seat cover set, fits most sedans.",
    price: 3200,
    icon: "seat",
    category: "Interior",
  },
];

export const galleryItems: GalleryItem[] = [
  { id: "cultus-1", car: "Suzuki Cultus", service: "Full exterior detailing" },
  { id: "corolla-1", car: "Toyota Corolla", service: "Interior deep clean" },
  { id: "civic-1", car: "Honda Civic", service: "Full detailing package" },
  { id: "yaris-1", car: "Toyota Yaris", service: "Ceramic coating" },
  { id: "sportage-1", car: "Kia Sportage", service: "Engine bay cleaning" },
  { id: "alto-1", car: "Suzuki Alto", service: "Headlight restoration" },
];
