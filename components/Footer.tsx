import Link from "next/link";
import { getSiteSettings } from "@/lib/cms";
import Icon from "./Icon";

export default async function Footer() {
  const siteConfig = await getSiteSettings();

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo">
              Car <span className="dot">Poshish</span>
            </Link>
            <p style={{ marginTop: 14 }}>
              A car detailing shop in Lahore. Drive in, and drive away shining.
            </p>
            {siteConfig ? (
              <div style={{ display: "flex", gap: 12 }}>
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
            ) : (
              <p className="footer-unavailable">Contact details are temporarily unavailable.</p>
            )}
          </div>

          <div>
            <h3>Quick Links</h3>
            <ul className="footer-list footer-list-plain">
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/shop">Shop Products</Link></li>
              <li><Link href="/seat-covers">Custom Seat Covers</Link></li>
              <li><Link href="/gallery">Our Work</Link></li>
              <li><Link href="/contact">Contact &amp; Location</Link></li>
            </ul>
          </div>

          <div>
            <h3>Contact Us</h3>
            {siteConfig ? (
              <ul className="footer-list">
                <li>
                  <Icon name="phone" size={16} />
                  <a href={`tel:${siteConfig.phone}`}>{siteConfig.phoneDisplay}</a>
                </li>
                <li>
                  <Icon name="chat" size={16} />
                  <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener">
                    WhatsApp Us
                  </a>
                </li>
                <li>
                  <Icon name="mail" size={16} />
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </li>
                <li>
                  <Icon name="pin" size={16} />
                  <span>{siteConfig.address.street}, {siteConfig.address.city}</span>
                </li>
              </ul>
            ) : (
              <p className="footer-unavailable">Unavailable right now.</p>
            )}
          </div>

          <div>
            <h3>Working Hours</h3>
            {siteConfig ? (
              <ul className="footer-list">
                <li>
                  <Icon name="clock" size={16} />
                  <span>{siteConfig.hoursDisplay}</span>
                </li>
              </ul>
            ) : (
              <p className="footer-unavailable">Unavailable right now.</p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig?.name || "Car Poshish"}. All rights reserved.</span>
          <span>Made with care in Lahore.</span>
        </div>
      </div>
    </footer>
  );
}
