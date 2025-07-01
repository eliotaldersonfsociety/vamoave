'use server';

import db from '@/lib/db/productos/db';
import { ordersTable } from '@/lib/ordenes/schema';
import { sql } from 'drizzle-orm';

export async function getTotalRevenue(): Promise<number> {
  const result = await db
    .select({ total: sql<number>`SUM(${ordersTable.total})` })
    .from(ordersTable)
    .execute();

  const total = result[0]?.total ?? 0;
  return Number(total);
}
