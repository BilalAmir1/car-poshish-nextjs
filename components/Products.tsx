import { getProducts } from "@/lib/cms";
import ProductsFilter from "./ProductsFilter";

export default async function Products() {
  const products = await getProducts();

  return <ProductsFilter products={products} />;
}
