// components/header/HotProductsBannerWrapper.tsx
import HotProductsBanner from "./hot-products-banner";
import { getHotProducts } from "@/app/helpers/getHotProducts";

export default async function HotProductsBannerWrapper() {
  const hotProducts = await getHotProducts();
  return <HotProductsBanner hotProducts={hotProducts} />;
}
