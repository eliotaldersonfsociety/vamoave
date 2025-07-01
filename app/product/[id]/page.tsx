import { getProductById } from "@/app/helpers/getProductsOne";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ Aquí se resuelve la promesa
  const productId = parseInt(id, 10);

  const product = await getProductById(productId);

  if (!product) {
    return <div className="text-center py-10">Producto no encontrado</div>;
  }

  return <ProductPageClient product={product} />;
}