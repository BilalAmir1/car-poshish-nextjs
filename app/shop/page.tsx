import type { Metadata } from "next";
import Products from "@/components/Products";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import { getProductsSchema } from "@/lib/structured-data";
import { getProducts, getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Buy car care products at Car Poshish in Lahore — shampoo, microfiber cloths, tyre shine, air fresheners, wax, ceramic sealant, and more. In-shop or order on WhatsApp.",
  alternates: { canonical: "/shop" },
};

export default async function ProductsPage() {
  // Fetched here too (in addition to inside <Products/>) only to build the
  // JSON-LD — Next.js dedupes the identical underlying fetch automatically,
  // so this isn't a second network round trip to the CMS.
  const [products, siteConfig] = await Promise.all([getProducts(), getSiteSettings()]);
  const productsSchema = getProductsSchema(siteConfig, products);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />

      <section style={{ paddingBottom: 0 }}>
        <div className="container section-head" style={{ marginBottom: 0 }}>
          <span className="kicker">Shop</span>
          <h1 style={{ fontSize: 38 }}>Car Care Products</h1>
          <p>
            Everything you need to keep your car looking fresh between
            visits. Buy in person at our shop, or message us on WhatsApp to
            reserve an item.
          </p>
        </div>
      </section>

      <section>
        <Products />
      </section>

      <Reveal>
        <CtaBanner />
      </Reveal>
    </>
  );
}
