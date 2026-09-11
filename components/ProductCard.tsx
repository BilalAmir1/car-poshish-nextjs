"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import Icon, { type IconName } from "./Icon";
import type { Product } from "@/lib/site-config";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="product-card">
      <div className="product-media" aria-hidden="true">
        <Icon name={product.icon as IconName} size={30} strokeWidth={1.4} />
      </div>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <span className="product-price">
            Rs. {product.price.toLocaleString("en-PK")}
          </span>
          <button
            type="button"
            className="btn btn-call"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            <Icon name={justAdded ? "check-circle" : "cart"} size={16} />
            {justAdded ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
