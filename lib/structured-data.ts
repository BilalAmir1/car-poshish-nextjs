import type { SiteSettings, Service, Faq, Product } from "./site-config";

// LocalBusiness (AutoWash subtype) schema.
// This is what tells Google Search, Google Maps, and AI answer engines
// (Google AI Overviews, ChatGPT, Perplexity, etc.) what your business is,
// where it is, what it costs, and when it's open.
export function getLocalBusinessSchema(siteConfig: SiteSettings, services: Service[]) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    image: `${siteConfig.url}/og-image.jpg`,
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
export function getProductsSchema(siteConfig: SiteSettings, products: Product[]) {
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
          url: `${siteConfig.url}/shop`,
          seller: {
            "@id": `${siteConfig.url}/#business`,
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
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: { "@id": `${siteConfig.url}/#business` },
  };
}
