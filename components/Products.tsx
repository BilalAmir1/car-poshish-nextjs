import { getProducts } from "@/lib/cms";
import ProductCard from "./ProductCard";

export default async function Products() {
  const products = await getProducts();

  return (
    <div className="container">
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      <p className="gallery-note">
        Prices shown are per item and may vary by stock. Add items to your
        cart to check out with pickup or delivery, or visit us in person.
      </p>
    </div>
  );
}
