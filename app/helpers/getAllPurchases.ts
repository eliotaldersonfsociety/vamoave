// helpers/getAllPurchases.ts
import db from '@/lib/db/productos/db';
import { ordersTable, orderItemsTable } from '@/lib/ordenes/schema';
import { eq, desc, sql } from 'drizzle-orm';

interface Params {
  page?: number;
  itemsPerPage?: number;
}

export async function getAllPurchases({ page = 1, itemsPerPage = 10 }: Params) {
  const offset = (page - 1) * itemsPerPage;

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(ordersTable);

  const total = totalResult[0]?.count || 0;

  const purchases = await db
    .select({
      id: ordersTable.id,
      name: ordersTable.name,
      email: ordersTable.email,
      phone: ordersTable.phone,
      address: ordersTable.address,
      city: ordersTable.city,
      department: ordersTable.department,
      paymentMethod: ordersTable.paymentMethod,
      shippingMethod: ordersTable.shippingMethod,
      shippingServiceName: ordersTable.shippingServiceName,
      shippingServiceBalance: ordersTable.shippingServiceBalance,
      total: ordersTable.total,
      status: ordersTable.status,
      createdAt: ordersTable.createdAt,
      items: sql`json_group_array(json_object(
        'id', ${orderItemsTable.id},
        'product_id', ${orderItemsTable.productId},
        'name', ${orderItemsTable.name},
        'price', ${orderItemsTable.price},
        'quantity', ${orderItemsTable.quantity},
        'image', ${orderItemsTable.image},
        'color', ${orderItemsTable.color},
        'size', ${orderItemsTable.size},
        'size_range', ${orderItemsTable.sizeRange}
      ))`.as('items')
    })
    .from(ordersTable)
    .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
    .groupBy(ordersTable.id)
    .orderBy(desc(ordersTable.createdAt))
    .limit(itemsPerPage)
    .offset(offset);

  const mappedPurchases = purchases.map((purchase) => {
    let items = [];
    try {
      const parsed = JSON.parse(purchase.items as unknown as string);
      if (Array.isArray(parsed)) items = parsed;
    } catch (e) {
      console.error('❌ Error al parsear items JSON:', e);
    }

    return {
      ...purchase,
      createdAt: purchase.createdAt ? new Date(purchase.createdAt).toISOString() : null,
      items,
      customer: {
        name: purchase.name || 'No disponible',
        email: purchase.email || 'No disponible',
        address: purchase.address || '',
        phone: purchase.phone || '',
        city: purchase.city || '',
        state: purchase.department || '',
        postal_code: '',
        house_apt: '',
      },
    };
  });

  return {
    purchases: mappedPurchases,
    pagination: {
      total,
      currentPage: page,
      itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    },
  };
}