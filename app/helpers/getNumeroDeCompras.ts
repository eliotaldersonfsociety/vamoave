'use server';

import db from '@/lib/db/productos/db';
import { ordersTable } from '@/lib/ordenes/schema';
import { count, desc } from 'drizzle-orm';

interface ComprasStats {
  numeroDeCompras: number;
  ultimaCompra: string | null;
}

export async function getNumeroDeCompras(): Promise<ComprasStats> {
  // Total de órdenes
  const totalResult = await db
    .select({ total: count() })
    .from(ordersTable);

  // Última orden (ordenada por fecha descendente)
  const ultimaOrden = await db
    .select({ createdAt: ordersTable.createdAt })
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(1);

  return {
    numeroDeCompras: totalResult[0]?.total ?? 0,
    ultimaCompra: ultimaOrden[0]?.createdAt ?? null,
  };
}
