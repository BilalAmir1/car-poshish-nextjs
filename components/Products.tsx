import { getProducts, getSiteSettings } from "@/lib/cms";
import Icon, { type IconName } from "./Icon";

export default async function Products() {
  const [products, siteConfig] = await Promise.all([getProducts(), getSiteSettings()]);

  return (
    <div className="container">
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
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
                <a
                  className="btn btn-whatsapp"
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                    `Hi, I'd like to order: ${product.name} (Rs. ${product.price.toLocaleString(
                      "en-PK"
                    )})`
                  )}`}
                  target="_blank"
                  rel="noopener"
                >
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="gallery-note">
        Prices shown are per item and may vary by stock. All products are
        also available to buy in person at our shop.
      </p>
    </div>
  );
}
