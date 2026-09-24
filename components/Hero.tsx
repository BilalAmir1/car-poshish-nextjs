import { getSiteSettings } from "@/lib/cms";
import Icon from "./Icon";

const stats = [
  { value: "1000+", label: "Cars Detailed" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Pay After Service" },
];

const notes = ["Walk-ins welcome", "Pay after service", "5+ years serving Lahore"];

export default async function Hero() {
  const siteConfig = await getSiteSettings();

  return (
    <section className="hero" id="home">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">
            <Icon name="pin" size={14} /> Visit us in Gulberg, Lahore
          </span>
          {/* Single H1 per page — this is the primary on-page SEO signal */}
          <h1>
            Give your car the <em>poshish</em> it deserves
          </h1>
          <p className="urdu-line">گاڑی کی مکمل صفائی، ہماری دکان پر</p>
          <p className="lead">
            Drive in to our shop in Lahore for a full inside-and-out
            detailing. Walk in any time, or call ahead to skip the wait.
          </p>
          <div className="hero-actions">
            {siteConfig ? (
              <>
                <a className="btn btn-call btn-lg" href={`tel:${siteConfig.phone}`}>
                  <Icon name="phone" size={18} />
                  Call Now: {siteConfig.phoneDisplay}
                </a>
                <a
                  className="btn btn-whatsapp btn-lg"
                  href={`https://wa.me/${siteConfig.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20book%20a%20car%20detailing%20service.`}
                  target="_blank"
                  rel="noopener"
                >
                  <Icon name="chat" size={18} />
                  Book on WhatsApp
                </a>
              </>
            ) : (
              <p className="hero-unavailable">
                Booking is temporarily unavailable — please check back shortly.
              </p>
            )}
          </div>

          <ul className="hero-note-list">
            {notes.map((note) => (
              <li key={note}>
                <Icon name="check" size={15} />
                {note}
              </li>
            ))}
          </ul>

          <div className="hero-stats">
            {stats.map((stat) => (
              <div className="hero-stat" key={stat.label}>
                <span className="hero-stat-value">{stat.value}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-art-backdrop" aria-hidden="true" />
          <div className="shine-wrap">
            <svg
              viewBox="0 0 420 260"
              width="100%"
              role="img"
              aria-label="Illustration of a shiny clean car"
            >
              <ellipse cx="210" cy="220" rx="150" ry="14" fill="#D9E7F5" />
              <path
                d="M60 175 C60 140 95 120 130 118 L150 90 C158 78 172 72 188 72 L255 72 C272 72 288 80 298 94 L318 118 C355 122 375 145 375 170 L375 190 C375 198 368 205 360 205 L340 205 C338 216 328 224 316 224 C304 224 294 216 292 205 L150 205 C148 216 138 224 126 224 C114 224 104 216 102 205 L78 205 C68 205 60 197 60 187 Z"
                fill="var(--ocean)"
              />
              <path
                d="M150 118 L166 90 C170 84 178 80 186 80 L252 80 C260 80 268 84 273 91 L290 118 Z"
                fill="#EAF3FB"
                opacity="0.5"
              />
              <line
                x1="205"
                y1="118"
                x2="205"
                y2="80"
                stroke="#EAF3FB"
                strokeWidth="2"
                opacity="0.4"
              />
              <circle cx="126" cy="205" r="21" fill="#14212E" />
              <circle cx="126" cy="205" r="9" fill="#B9C6D2" />
              <circle cx="316" cy="205" r="21" fill="#14212E" />
              <circle cx="316" cy="205" r="9" fill="#B9C6D2" />
            </svg>

            <div className="hero-float-badge">
              <span className="hero-float-stars">★★★★★</span>
              <span>
                <strong>4.9 / 5</strong>
                <span>Rated by customers</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
