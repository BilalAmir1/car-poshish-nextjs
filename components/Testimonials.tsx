import { getTestimonials } from "@/lib/cms";

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section id="testimonials" className="alt-bg">
      <div className="container">
        <div className="section-head">
          <span className="kicker">What Our Customers Say</span>
          <h2>Trusted by Car Owners Across Lahore</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="stars" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <p className="quote">&quot;{t.quote}&quot;</p>
              <div className="testimonial-name">
                <span className="avatar" aria-hidden="true">
                  {t.initials}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <span>{t.location}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
