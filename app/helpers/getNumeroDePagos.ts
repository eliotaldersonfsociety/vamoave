import { db } from '@/lib/db/index';
import { epaycoOrders } from '@/lib/epayco/schema';
import { sql } from 'drizzle-orm';

export async function getNumeroDePagos(): Promise<{
  count: number;
  lastPurchaseDate: string | null;
}> {
  try {
    const [result] = await db.epayco
      .select({
        count: sql<number>`COUNT(*)`,
        lastPurchaseDate: sql<string>`MAX(processing_date)`,
      })
      .from(epaycoOrders);

      const lastDateFormatted =
        result?.lastPurchaseDate !== undefined && result.lastPurchaseDate !== null
          ? new Date(Number(result.lastPurchaseDate) * 1000).toISOString()
          : null;

    return {
      count: result?.count || 0,
      lastPurchaseDate: lastDateFormatted,
    };
  } catch (error) {
    console.error('[GET_NUMERO_DE_PAGOS] Error al contar órdenes:', error);
    throw new Error('No se pudo obtener el número de pagos');
  }
}
