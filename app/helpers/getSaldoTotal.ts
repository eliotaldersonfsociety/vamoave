import db from '@/lib/db/productos/db';
import { epaycoOrders } from '@/lib/epayco/schema';
import { sql } from 'drizzle-orm';

export async function getSaldoTotal(): Promise<number> {
  try {
    const [result] = await db
      .select({
        totalAmount: sql<number>`SUM(amount)`,
      })
      .from(epaycoOrders);

    console.log("🔎 Resultado crudo del totalAmount:", result);
    console.log("💰 Total calculado:", result?.totalAmount);

    return result?.totalAmount || 0;
  } catch (error) {
    console.error('[GET_SALDO_TOTAL] ❌ Error al calcular el saldo total:', error);
    throw new Error('No se pudo calcular el saldo total');
  }
}
