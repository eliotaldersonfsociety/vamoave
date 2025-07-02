// app/helpers/getHotProducts.ts

import { db } from "@/lib/db/index";
import { productsTable } from "@/lib/products/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

// Esquema para validar productos seleccionados
const selectProductSchema = createSelectSchema(productsTable);
export type Product = z.infer<typeof selectProductSchema>;

// Utilidades para parseo seguro de arrays y objetos
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

// Helper principal para obtener productos aleatorios
export async function getHotProducts(limit = 4): Promise<Product[]> {
  try {
    const rawProducts = await db
      .select()
      .from(productsTable)
      .orderBy(sql`RANDOM()`) // PostgreSQL / SQLite
      .limit(limit);

    return rawProducts.map((product: any) => ({
      ...product,
      status: product.status ?? 0,
      images: getValidImages(product.images),
      tags: parseMaybeJSONOrCSV(product.tags),
      sizes: parseMaybeJSONOrCSV(product.sizes),
      size_range: parseMaybeJSON(product.size_range, { min: 18, max: 45 }),
      colors: parseMaybeJSONOrCSV(product.colors),
    }));
  } catch (error) {
    console.error("Error en getHotProducts:", error);
    return [];
  }
}
