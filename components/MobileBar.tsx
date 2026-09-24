import { getSiteSettings } from "@/lib/cms";
import Icon from "./Icon";

export default async function MobileBar() {
  const siteConfig = await getSiteSettings();

  // Nothing useful to show without real contact details — hide the bar
  // entirely rather than render broken/empty Call & WhatsApp buttons.
  if (!siteConfig) return null;

  return (
    <div className="mobile-bar" role="region" aria-label="Quick contact">
      <a className="btn btn-call" href={`tel:${siteConfig.phone}`}>
        <Icon name="phone" size={16} /> Call
      </a>
      <a
        className="btn btn-whatsapp"
        href={`https://wa.me/${siteConfig.whatsapp}`}
        target="_blank"
        rel="noopener"
      >
        <Icon name="chat" size={16} /> WhatsApp
      </a>
    </div>
  );
}
