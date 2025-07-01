// app/paginxxa/page.tsx
import { getProducts } from "@/app/helpers/getProducts";
import HeroBanner from "@/components/hero/page";
import { ProductGrid } from "@/components/product-grid";
import { Suspense } from "react";
import FeatureCards from "@/components/FeatureCards";
import { Product } from '@/lib/products/schema';

async function ProductsSection() {
  const rawProducts = await getProducts();
  const products: Product[] = rawProducts.map((product: any) => ({
  ...product,
  tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags,
  status: Boolean(product.status), // ✅ Conversión explícita
}));

  return <ProductGrid products={products} />;
}

export default function PaginaPage() {
  return (
    <>
      <HeroBanner />
      <FeatureCards/>
      <div className="w-full bg-gray-200 min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 p-4 md:p-8">
      <Suspense fallback={<p className="text-center py-8">Cargando productos...</p>}>
        <ProductsSection />
      </Suspense>
        </div>
        </div>
    </>
  );
}
