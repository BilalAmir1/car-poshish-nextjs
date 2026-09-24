import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings, getServices } from "@/lib/cms";
import { getLocalBusinessSchema, getWebsiteSchema } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site-config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import PageTransition from "@/components/PageTransition";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

// Fraunces has real personality (a soft-serif with sharp, tapered
// terminals) instead of the rounded, friendly-by-default display fonts
// most template-style sites reach for. Using it only at a few weights and
// pairing it with plain Inter for everything else is what keeps it reading
// as a deliberate choice rather than decoration.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
  display: "swap",
});

// Used only for prices — a small, functional detail (like a receipt or
// spec sheet) rather than a decorative "tech" motif.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "700"],
  display: "swap",
});

// generateMetadata (rather than a static `export const metadata`) so
// title/description/OG tags come from the CMS's Site Settings. If the CMS
// is unreachable, this uses generic placeholders ("Site is temporarily
// unavailable") rather than fabricated business details — the point is
// that a broken CMS connection should be obvious, not hidden behind
// content that looks normal.
export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteSettings();

  const name = siteConfig?.name || "Site Unavailable";
  const tagline = siteConfig?.tagline || "Content could not be loaded";
  const description =
    siteConfig?.description ||
    "This site's content is temporarily unavailable. Please check back shortly.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
    keywords: siteConfig
      ? [
          "car detailing Lahore",
          "car wash Lahore",
          "car detailing shop Gulberg",
          "interior car cleaning Lahore",
          "car polish Lahore",
          "ceramic coating Lahore",
          "car wash shop Pakistan",
        ]
      : [],
    authors: siteConfig ? [{ name }] : [],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: SITE_URL,
      siteName: name,
      title: `${name} — ${tagline}`,
      description,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${tagline}`,
      description,
      images: ["/og-image.jpg"],
    },
    robots: {
      // If the CMS is down, deliberately tell search engines not to index
      // this response — an "unavailable" page shouldn't get indexed as if
      // it were the site's real content.
      index: !!siteConfig,
      follow: true,
      googleBot: {
        index: !!siteConfig,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.svg",
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#0F3D68",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Next.js automatically dedupes identical fetch() calls within a single
  // render, so calling getSiteSettings() here AND inside Header/Footer/
  // MobileBar/etc. does not mean extra network round trips to Strapi.
  const [siteConfig, services] = await Promise.all([getSiteSettings(), getServices()]);

  // No siteConfig means the CMS is unreachable — skip structured data
  // entirely rather than emit LocalBusiness/FAQ schema with placeholder
  // values. Fabricated structured data is worse than none: it actively
  // misinforms Google/AI answer engines about the business.
  const localBusinessSchema = siteConfig ? getLocalBusinessSchema(siteConfig, services) : null;
  const websiteSchema = siteConfig ? getWebsiteSchema(siteConfig) : null;

  return (
    <html
      lang="en"
      className={`${display.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* Sitewide structured data: tells Google, Maps, and AI answer
            engines what the business is, where it is, and what it offers. */}
        {localBusinessSchema && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          />
        )}
        {websiteSchema && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
        )}

        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <CartProvider>
          <Header phone={siteConfig?.phone ?? ""} />
          <main id="main">
            <PageTransition>{children}</PageTransition>
          </main>
          <CartDrawer />
          <Footer />
          <MobileBar />
        </CartProvider>
      </body>
    </html>
  );
}
