'use server';

import db from '@/lib/db/productos/db';
import { ordersTable } from '@/lib/ordenes/schema';
import { count, desc, max } from 'drizzle-orm';

export async function getNumeroDeCompras(): Promise<{
  numeroDeCompras: number;
  ultimaCompra: string | null;
}> {
  const totalResult = await db
    .select({ total: count() })
    .from(ordersTable);

  const lastDateResult = await db
    .select({ ultimaCompra: max(ordersTable.createdAt) })
    .from(ordersTable);

  return {
    numeroDeCompras: totalResult[0]?.total ?? 0,
    ultimaCompra: lastDateResult[0]?.ultimaCompra ?? null,
  };
}
