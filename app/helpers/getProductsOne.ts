// app/helpers/productHelpers.ts
import { eq } from "drizzle-orm";
import db from "@/lib/db/productos/db";
import { productsTable, shippingServicesTable } from "@/lib/products/schema";
import { Product, ShippingService } from "@/types/productos";

export async function getProductById(id: number): Promise<Product | null> {
  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);

  if (product.length === 0) return null;
  const p = product[0];

  // Obtener servicios de envío relacionados
  const shippingServices = await db
    .select()
    .from(shippingServicesTable)
    .where(eq(shippingServicesTable.productId, p.id));

  // Funciones auxiliares para parsear datos
  const parseArray = <T>(value: any, defaultValue: T[] = []): T[] => {
    try {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return JSON.parse(value);
      return defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const parseJSON = <T>(value: any, defaultValue: T): T => {
    try {
      if (typeof value === 'string') return JSON.parse(value);
      return value || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Mapear los servicios de envío al tipo correcto
  const mappedShippingServices: ShippingService[] = shippingServices.map(s => ({
    name: s.name,
    balance: s.balance
  }));

  // Construir el objeto Product
  return {
    id: p.id,
    title: p.title,
    description: p.description || '',
    price: p.price,
    compare: p.compare_at_price ?? null,
    cost_per_item: p.cost_per_item ?? null,
    vendor: p.vendor ?? null,
    type: p.product_type ?? null,
    status: !!p.status, // Convertir a boolean explícitamente
    category: p.category ?? null,
    tags: parseArray<string>(p.tags),
    sku: p.sku ?? null,
    barcode: p.barcode ?? null,
    quantity: p.quantity ?? 0,
    track: p.track_inventory,
    images: parseArray<string>(p.images),
    sizes: parseArray<string>(p.sizes),
    colors: parseArray<string>(p.colors),
    range: parseJSON<{ min: number; max: number }>(p.size_range, { min: 0, max: 0 }),
    shipping_services: mappedShippingServices
  };
}

export async function updateProductById(id: number, data: Partial<Product>) {
  // Preparar los datos para la actualización
  const updatedData = {
    title: data.title,
    description: data.description,
    price: data.price,
    compare_at_price: data.compare ?? null,
    cost_per_item: data.cost_per_item ?? null,
    vendor: data.vendor ?? null,
    product_type: data.type ?? null,
    status: data.status ? 1 : 0,
    category: data.category ?? null,
    tags: JSON.stringify(data.tags || []),
    sku: data.sku ?? null,
    barcode: data.barcode ?? null,
    quantity: data.quantity ?? 0,
    track_inventory: data.trackInventory ? 1 : 0,
    images: JSON.stringify(data.images || []),
    sizes: JSON.stringify(data.sizes || []),
    colors: JSON.stringify(data.colors || []),
    size_range: JSON.stringify(data.range || { min: 0, max: 0 })
  };

  return await db
    .update(productsTable)
    .set(updatedData)
    .where(eq(productsTable.id, id));
}

export async function deleteProductById(id: number): Promise<void> {
  await db
    .delete(productsTable)
    .where(eq(productsTable.id, id));
}
