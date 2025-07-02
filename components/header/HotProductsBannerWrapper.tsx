// components/HotProductsBannerWrapper.tsx
import { getHotProducts } from "@/app/helpers/getHotProducts";
import HotProductsBanner from "./hot-products-banner";

export default async function HotProductsBannerWrapper() {
  const hotProducts = await getHotProducts();

  return <HotProductsBanner hotProducts={hotProducts} />;
}
