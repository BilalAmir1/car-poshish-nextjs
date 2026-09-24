import type { Metadata } from "next";
import Faq from "@/components/Faq";
import LocationMap from "@/components/LocationMap";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact & Location",
  description:
    "Find Car Poshish's shop in Gulberg III, Lahore. Get directions, call, or WhatsApp us — open Monday to Sunday, 9 AM to 8 PM.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const siteConfig = await getSiteSettings();

  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="kicker">Get In Touch</span>
          <h1 style={{ fontSize: 38 }}>Contact &amp; Location</h1>
          <p>
            Come see us, or reach out first — whichever is easier for you.
          </p>
        </div>
      </section>

      <section>
        <div className="container contact-grid">
          <div className="contact-info-card">
            <h3>Shop Details</h3>
            {siteConfig ? (
              <>
                <ul className="contact-detail-list">
                  <li>
                    <span className="contact-icon" aria-hidden="true"><Icon name="pin" size={17} /></span>
                    <span>
                      <strong>Address</strong>
                      {siteConfig.address.street}, {siteConfig.address.city},{" "}
                      {siteConfig.address.region}
                    </span>
                  </li>
                  <li>
                    <span className="contact-icon" aria-hidden="true"><Icon name="phone" size={17} /></span>
                    <span>
                      <strong>Phone</strong>
                      <a href={`tel:${siteConfig.phone}`}>{siteConfig.phoneDisplay}</a>
                    </span>
                  </li>
                  <li>
                    <span className="contact-icon" aria-hidden="true"><Icon name="chat" size={17} /></span>
                    <span>
                      <strong>WhatsApp</strong>
                      <a
                        href={`https://wa.me/${siteConfig.whatsapp}`}
                        target="_blank"
                        rel="noopener"
                      >
                        Message us on WhatsApp
                      </a>
                    </span>
                  </li>
                  <li>
                    <span className="contact-icon" aria-hidden="true"><Icon name="mail" size={17} /></span>
                    <span>
                      <strong>Email</strong>
                      <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                    </span>
                  </li>
                  <li>
                    <span className="contact-icon" aria-hidden="true"><Icon name="clock" size={17} /></span>
                    <span>
                      <strong>Hours</strong>
                      {siteConfig.hoursDisplay}
                    </span>
                  </li>
                </ul>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a className="btn btn-call" href={`tel:${siteConfig.phone}`}>
                    Call Now
                  </a>
                  <a
                    className="btn btn-whatsapp"
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener"
                  >
                    WhatsApp
                  </a>
                </div>
              </>
            ) : (
              <p className="content-unavailable">
                Contact details are temporarily unavailable. Please check
                back shortly.
              </p>
            )}
          </div>

          <LocationMap />
        </div>
      </section>

      <Reveal>
        <Faq />
      </Reveal>
    </>
  );
}
