'use server';

import db from '@/lib/db/productos/db';
import { ordersTable, orderItemsTable } from '@/lib/ordenes/schema';
import { eq } from 'drizzle-orm';

export async function getOrderDetails(orderId: string) {
  // Obtener orden
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));

  if (!order) {
    throw new Error(`No se encontró la orden con ID: ${orderId}`);
  }

  // Obtener productos relacionados a la orden
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, orderId));

  return {
    id: order.id,
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    department: order.department,
    paymentMethod: order.paymentMethod,
    shippingMethod: order.shippingMethod,
    shippingServiceName: order.shippingServiceName,
    shippingServiceBalance: order.shippingServiceBalance,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    items: items.map((item) => ({
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      color: item.color,
      size: item.size,
      sizeRange: item.sizeRange,
    })),
  };
}
