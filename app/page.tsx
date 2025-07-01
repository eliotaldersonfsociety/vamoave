// app/pagina/page.tsx
import { getProducts } from "@/app/helpers/getProducts";
import HeroBanner from "@/components/hero/page";
import { ProductGrid } from "@/components/product-grid";
import { Suspense } from "react";
import FeatureCards from "@/components/FeatureCards";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
  status: boolean;
  images: string[];
  // Puedes agregar sizes, colors, etc. si los usas
}

async function ProductsSection() {
  const products: Product[] = await getProducts();

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
