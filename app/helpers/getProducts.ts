// app/helpers/getProducts.ts
import db from "@/lib/db/productos/db";
import { productsTable, shippingServicesTable } from "@/lib/products/schema";
import { eq } from "drizzle-orm";

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

export async function getProducts() {
  try {
    const allProducts = await db.select().from(productsTable);

    const formattedProducts = await Promise.all(
      allProducts.map(async (product) => {
        const shippingServices = await db
          .select()
          .from(shippingServicesTable)
          .where(eq(shippingServicesTable.productId, product.id));

        return {
          ...product,
          status: product.status ?? 0,
          images: getValidImages(product.images),
          tags: parseMaybeJSONOrCSV(product.tags),
          sizes: parseMaybeJSONOrCSV(product.sizes),
          size_range: parseMaybeJSON(product.size_range, { min: 18, max: 45 }),
          colors: parseMaybeJSONOrCSV(product.colors),
          shipping_services: shippingServices,
        };
      })
    );

    return formattedProducts;
  } catch (err) {
    console.error("Error al obtener productos desde helper:", err);
    return [];
  }
}
