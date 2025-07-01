'use server';

import db from '@/lib/db/productos/db';
import { ordersTable, orderItemsTable } from '@/lib/ordenes/schema';
import { productsTable } from '@/lib/products/schema'; // Importación corregida
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm'; // Importamos operador `eq`
import type { CartItem, DeliveryInfo, ShippingService } from '@/types/productos';

interface SaveOrderOptions {
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  paymentMethod: string;
  shippingMethod: string;
  selectedService: ShippingService | null;
  total: number;
  status: string;
}

export async function saveOrderAction({
  items,
  deliveryInfo,
  paymentMethod,
  shippingMethod,
  selectedService,
  total,
  status,
}: SaveOrderOptions): Promise<{ orderId: string }> {
  const orderId = nanoid(12);

  // Guardar la orden principal
  await db.insert(ordersTable).values({
    id: orderId,
    name: deliveryInfo.name,
    email: deliveryInfo.email,
    phone: deliveryInfo.phone,
    address: deliveryInfo.address,
    city: deliveryInfo.city,
    department: deliveryInfo.department,
    paymentMethod,
    shippingMethod,
    shippingServiceName: selectedService?.name || null,
    shippingServiceBalance: selectedService?.balance || null,
    total,
    status,
    createdAt: new Date().toISOString(),
  });

  // Procesar cada ítem del carrito
  for (const item of items) {
    const productId = Number(item.id);
    const quantityToDeduct = item.quantity;

    // Buscar producto usando `eq`
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!product) {
      throw new Error(`Producto con ID ${productId} no encontrado.`);
    }

    if (product.quantity < quantityToDeduct) {
      throw new Error(`Stock insuficiente para "${item.name}".`);
    }

    // Restar stock
    await db
      .update(productsTable)
      .set({ quantity: product.quantity - quantityToDeduct })
      .where(eq(productsTable.id, productId));

    // Guardar ítem de la orden
    await db.insert(orderItemsTable).values({
      orderId,
      productId,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      image: typeof item.image === 'string' ? item.image : '',
      color: item.color || '',
      size: item.size || '',
      sizeRange: item.sizeRange || '',
    });
  }

  return { orderId };
}