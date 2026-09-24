import { SITE_URL, type SiteSettings, type Service, type Faq, type Product } from "./site-config";

// LocalBusiness (AutoWash subtype) schema.
// This is what tells Google Search, Google Maps, and AI answer engines
// (Google AI Overviews, ChatGPT, Perplexity, etc.) what your business is,
// where it is, what it costs, and when it's open.
export function getLocalBusinessSchema(siteConfig: SiteSettings, services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    "@id": `${SITE_URL}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: SITE_URL,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    image: `${SITE_URL}/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    areaServed: {
      "@type": "City",
      name: "Lahore",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Car Detailing Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        priceCurrency: "PKR",
        price: service.price,
        availability: "https://schema.org/InStock",
      })),
    },
    // NOTE: Only add "aggregateRating" once you have genuine reviews to back
    // it up (e.g. synced from your Google Business Profile). Fabricated
    // ratings violate Google's structured data guidelines and can get your
    // listing penalized, so it's deliberately left out of this template.
  };
}

// FAQPage schema — makes your FAQ section eligible for rich results
// (expandable Q&A snippets directly in Google search results).
export function getFaqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Product catalog schema for the /shop page — helps individual products
// surface in Google Shopping-style results and AI answer engines.
export function getProductsSchema(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Car Poshish Shop Products",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        category: product.category,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/shop`,
          seller: {
            "@id": `${SITE_URL}/#business`,
          },
        },
      },
    })),
  };
}

// WebSite schema — kept minimal on purpose. Add BreadcrumbList / additional
// page schemas here as the site grows.
export function getWebsiteSchema(siteConfig: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteConfig.name,
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}
