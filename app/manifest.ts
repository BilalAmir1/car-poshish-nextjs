import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms";

// Unlike other pages, a PWA manifest can't sensibly render an "content
// unavailable" state — it's consumed by the OS, not shown to a user. If
// the CMS is unreachable, this falls back to a generic technical name
// rather than fabricated business details, since that distinction still
// matters: "Website" is honestly generic, not pretending to be real data.
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const siteConfig = await getSiteSettings();

  return {
    name: siteConfig?.name || "Website",
    short_name: siteConfig?.name || "Website",
    description: siteConfig?.description || "",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F3D68",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
