import db from "@/lib/db";
import { productsTable } from "@/lib/products/schema";
import { eq } from "drizzle-orm";

// Si usas Zod:
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

const selectProductSchema = createSelectSchema(productsTable);
type Product = z.infer<typeof selectProductSchema>;

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

export async function getHotProducts(): Promise<Product[]> {
  try {
    const allProducts = await db.select().from(productsTable); // 👈 corrección

    if (!allProducts.length) return [];

    const formatted = allProducts.map((product: any) => ({
      ...product,
      images: getValidImages(product.images),
      tags: parseMaybeJSONOrCSV(product.tags),
      sizes: parseMaybeJSONOrCSV(product.sizes),
      size_range: parseMaybeJSON(product.size_range, { min: 18, max: 45 }),
      colors: parseMaybeJSONOrCSV(product.colors),
    }));

    return getRandom(formatted, 4); // Solo 4 productos hot
  } catch (error) {
    console.error("Error en getHotProducts():", error);
    return [];
  }
}
