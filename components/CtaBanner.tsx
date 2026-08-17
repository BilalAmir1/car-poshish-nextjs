import { getSiteSettings } from "@/lib/cms";

export default async function CtaBanner() {
  const siteConfig = await getSiteSettings();

  return (
    <section>
      <div className="cta-banner">
        <h2>Ready for a Fresh Shine?</h2>
        <p>Walk in any time, or call and WhatsApp us ahead to skip the wait.</p>
        <div className="cta-actions">
          <a className="btn btn-call btn-lg" href={`tel:${siteConfig.phone}`}>
            Call Now: {siteConfig.phoneDisplay}
          </a>
          <a
            className="btn btn-whatsapp btn-lg"
            href={`https://wa.me/${siteConfig.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20car%20detailing%20service.`}
            target="_blank"
            rel="noopener"
          >
            Book on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
