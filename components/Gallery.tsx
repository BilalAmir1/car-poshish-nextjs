import { getGalleryItems } from "@/lib/cms";

export default async function Gallery({ showHeading = true }: { showHeading?: boolean }) {
  const items = await getGalleryItems();

  return (
    <section id="gallery">
      <div className="container">
        {showHeading && (
          <div className="section-head">
            <span className="kicker">Our Work</span>
            <h2>See the Difference</h2>
            <p>A few examples of cars we&apos;ve recently given a fresh Poshish.</p>
          </div>
        )}

        <div className="gallery-grid">
          {items.map((item) => (
            <div className="gallery-pair" key={item.id}>
              <div className="gallery-imgs">
                {/*
                  TODO: replace these placeholder blocks with real <Image />
                  components (next/image) once you have before/after photos.
                  If they're managed in Strapi's Gallery Item content type
                  (beforeImage/afterImage media fields), read them from the
                  raw Strapi response in lib/cms.ts's getGalleryItems() and
                  pass the URLs through here instead.
                */}
                <div className="gallery-block before">Before</div>
                <div className="gallery-block after">After</div>
              </div>
              <div className="gallery-caption">
                <strong>{item.car}</strong>
                {item.service}
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="content-unavailable">
            Our gallery is temporarily unavailable. Please check back shortly.
          </p>
        ) : (
          <p className="gallery-note">
            Replace these placeholder blocks with your own before/after photos
            once you have them.
          </p>
        )}
      </div>
    </section>
  );
}
