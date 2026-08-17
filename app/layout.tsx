import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings, getServices } from "@/lib/cms";
import { getLocalBusinessSchema, getWebsiteSchema } from "@/lib/structured-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import PageTransition from "@/components/PageTransition";

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

// generateMetadata (rather than a static `export const metadata`) so the
// title/description/OG tags can come from the CMS's Site Settings when
// it's configured, and fall back to the same defaults otherwise.
export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "car detailing Lahore",
      "car wash Lahore",
      "car detailing shop Gulberg",
      "interior car cleaning Lahore",
      "car polish Lahore",
      "ceramic coating Lahore",
      "car wash shop Pakistan",
    ],
    authors: [{ name: siteConfig.name }],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — Doorstep Car Detailing in Lahore`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
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

  const localBusinessSchema = getLocalBusinessSchema(siteConfig, services);
  const websiteSchema = getWebsiteSchema(siteConfig);

  return (
    <html
      lang="en"
      className={`${display.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* Sitewide structured data: tells Google, Maps, and AI answer
            engines what the business is, where it is, and what it offers. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header phone={siteConfig.phone} />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <MobileBar />
      </body>
    </html>
  );
}
