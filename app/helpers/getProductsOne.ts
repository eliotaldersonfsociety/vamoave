// app/helpers/productHelpers.ts
import { eq } from "drizzle-orm";
import db from "@/lib/db/productos/db";
import { productsTable, shippingServicesTable } from "@/lib/products/schema";

export async function getProductById(id: number) {
  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);

  if (product.length === 0) return null;
  const p = product[0];

  // Obtener servicios de envío relacionados
  const shipping_services = await db
    .select()
    .from(shippingServicesTable)
    .where(eq(shippingServicesTable.productId, p.id));

  // Parseos
  const parseArray = (value: any): string[] => {
    try {
      return Array.isArray(value)
        ? value
        : typeof value === "string"
        ? JSON.parse(value)
        : [];
    } catch {
      return [];
    }
  };

  const parseJSON = (value: any) => {
    try {
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch {
      return {};
    }
  };

  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    price: p.price,
    compare: p.compare_at_price ?? null,
    cost_per_item: p.cost_per_item ?? null,
    vendor: p.vendor ?? null,
    type: p.product_type ?? null,
    status: typeof p.status === "number" ? p.status === 1 : p.status ?? undefined,
    category: p.category ?? null,
    tags: parseArray(p.tags),
    sku: p.sku ?? null,
    barcode: p.barcode ?? null,
    quantity: p.quantity ?? undefined,
    track:
      typeof p.track_inventory === "number"
        ? p.track_inventory === 1
        : p.track_inventory ?? undefined,
    images: parseArray(p.images),
    sizes: parseArray(p.sizes),
    colors: parseArray(p.colors),
    range: parseJSON(p.size_range),
    shipping_services,
  };
}

export async function updateProductById(id: number, data: any) {
  const updatedData = {
    ...data,
    images: Array.isArray(data.images) ? JSON.stringify(data.images) : "[]",
    sizes: Array.isArray(data.sizes) ? JSON.stringify(data.sizes) : "[]",
    colors: Array.isArray(data.colors) ? JSON.stringify(data.colors) : "[]",
    tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : "[]",
    size_range: data.sizeRange ? JSON.stringify(data.sizeRange) : null,
    status: typeof data.status === "boolean" ? (data.status ? 1 : 0) : undefined,
    track_inventory: typeof data.trackInventory === "boolean" ? (data.trackInventory ? 1 : 0) : undefined,
  };

  return await db
    .update(productsTable)
    .set(updatedData)
    .where(eq(productsTable.id, id));
}

export async function deleteProductById(id: number) {
  // Debido a ON DELETE CASCADE, no necesitas borrar manualmente los servicios de envío
  const result = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id));

  return result;
}
