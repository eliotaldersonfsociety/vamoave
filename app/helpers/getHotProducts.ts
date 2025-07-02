// app/helpers/getHotProducts.ts
import db from '@/lib/db/productos/db';
import { productsTable } from "@/lib/products/schema";

function parseMaybeJSONOrCSV(value: any): string[] {
  if (!value || value === "" || value === "null") return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return typeof value === "string" ? value.split(",").map((v) => v.trim()) : [];
  }
}

function parseMaybeJSON(value: any, fallback: any = {}) {
  if (!value || value === "" || value === "null") return fallback;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
}

function getValidImages(images: any): string[] {
  const imgs = parseMaybeJSONOrCSV(images);
  if (!imgs.length || !imgs[0]) {
    return ["/no-image.png"];
  }
  return imgs;
}

function getRandom<T>(array: T[], count: number): T[] {
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Este tipo debe coincidir con el de hot-products-banner.tsx
export type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  size_range?: { min: number; max: number };
};

export async function getHotProducts(): Promise<Product[]> {
  try {
    const allProducts = await db.select().from(productsTable);

    const formatted = allProducts.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      images: getValidImages(product.images),
      tags: parseMaybeJSONOrCSV(product.tags),
      sizes: parseMaybeJSONOrCSV(product.sizes),
      colors: parseMaybeJSONOrCSV(product.colors),
      size_range: parseMaybeJSON(product.size_range, { min: 18, max: 45 }),
    }));

    return getRandom(formatted, 4);
  } catch (error) {
    console.error("Error en getHotProducts():", error);
    return [];
  }
}
