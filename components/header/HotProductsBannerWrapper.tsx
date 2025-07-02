// components/header/HotProductsBannerWrapper.tsx
import { getHotProducts, Product } from "@/app/helpers/getHotProducts";
import HotProductsBanner from "./hot-products-banner";

export default async function HotProductsBannerWrapper() {
  const hotProducts: Product[] = await getHotProducts();
  return <HotProductsBanner hotProducts={hotProducts} />;
}
