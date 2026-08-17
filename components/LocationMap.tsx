import { getSiteSettings } from "@/lib/cms";

export default async function LocationMap() {
  const siteConfig = await getSiteSettings();
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    siteConfig.mapQuery
  )}&output=embed`;

  return (
    <div className="map-wrap">
      <iframe
        src={src}
        title={`Map showing the location of ${siteConfig.name} in ${siteConfig.address.city}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
