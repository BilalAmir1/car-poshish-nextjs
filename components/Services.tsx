import Link from "next/link";
import { getServices } from "@/lib/cms";
import Icon, { type IconName } from "./Icon";

export default async function Services({
  limit,
  showViewAll = false,
  showHeading = true,
  altBg = false,
}: {
  limit?: number;
  showViewAll?: boolean;
  showHeading?: boolean;
  altBg?: boolean;
}) {
  const services = await getServices();
  const list = limit ? services.slice(0, limit) : services;

  return (
    <section id="services" className={altBg ? "alt-bg" : undefined}>
      <div className="container">
        {showHeading && (
          <div className="section-head">
            <span className="kicker">Our Services</span>
            <h2>Everything Your Car Needs to Shine</h2>
            <p>
              Simple, honest services. Tell us what your car needs and
              we&apos;ll take care of the rest.
            </p>
          </div>
        )}

        <div className="services-grid">
          {list.map((service, i) => (
            <div className="service-card" key={service.id}>
              <div className="service-card-top">
                <span className="service-index">{String(i + 1).padStart(2, "0")}</span>
                <Icon name={service.icon as IconName} size={22} />
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-price">
                <span className="from">Starting from</span>
                Rs. {service.price.toLocaleString("en-PK")}
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <p className="content-unavailable">
            Services are temporarily unavailable. Please check back shortly,
            or call/WhatsApp us directly.
          </p>
        )}

        {showViewAll && (
          <div className="section-cta">
            <Link className="btn btn-ghost" href="/services">
              View All Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
