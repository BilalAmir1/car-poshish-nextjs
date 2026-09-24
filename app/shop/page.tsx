import type { Metadata } from "next";
import Products from "@/components/Products";
import CtaBanner from "@/components/CtaBanner";
import Reveal from "@/components/Reveal";
import { getProductsSchema } from "@/lib/structured-data";
import { getProducts } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Buy car care products at Car Poshish in Lahore — shampoo, microfiber cloths, tyre shine, air fresheners, wax, ceramic sealant, and more. In-shop or order on WhatsApp.",
  alternates: { canonical: "/shop" },
};

export default async function ProductsPage() {
  const products = await getProducts();
  const productsSchema = products.length > 0 ? getProductsSchema(products) : null;

  return (
    <>
      {productsSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
        />
      )}

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
