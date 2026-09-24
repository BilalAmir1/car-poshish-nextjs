"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/site-config";

export default function ProductsFilter({ products }: { products: Product[] }) {
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const p of products) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        ordered.push(p.category);
      }
    }
    return ordered;
  }, [products]);

  const [active, setActive] = useState<string>("All");

  // Nothing loaded at all (CMS unreachable) — different message from
  // "this category has nothing in it", since one is expected and the
  // other means something's actually wrong.
  if (products.length === 0) {
    return (
      <div className="container">
        <p className="content-unavailable">
          Products are temporarily unavailable. Please check back shortly,
          or call/WhatsApp us directly.
        </p>
      </div>
    );
  }

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="container">
      <div className="category-filters" role="tablist" aria-label="Filter products by category">
        <button
          type="button"
          role="tab"
          aria-selected={active === "All"}
          className={`category-filter${active === "All" ? " active" : ""}`}
          onClick={() => setActive("All")}
        >
          All Products
          <span className="category-count">{products.length}</span>
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active === category}
            className={`category-filter${active === category ? " active" : ""}`}
            onClick={() => setActive(category)}
          >
            {category}
            <span className="category-count">
              {products.filter((p) => p.category === category).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="gallery-note">No products in this category yet.</p>
      ) : (
        <div className="products-grid">
          {filtered.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}

      <p className="gallery-note">
        Prices shown are per item and may vary by stock. Add items to your
        cart to check out with pickup or delivery, or visit us in person.
      </p>
    </div>
  );
}
