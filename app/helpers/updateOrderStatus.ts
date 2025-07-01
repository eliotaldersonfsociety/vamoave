'use server'

import db from '@/lib/db/productos/db'
import { ordersTable } from '@/lib/ordenes/schema'
import { eq } from 'drizzle-orm'

export async function updateOrderStatus(id: string, newStatus: string) {
  if (!id || !newStatus) throw new Error("ID y nuevo estado son requeridos")

  try {
    await db
      .update(ordersTable)
      .set({ status: newStatus })
      .where(eq(ordersTable.id, id))

    // ✅ Devuelve solo valores primitivos simples
    return {
      success: true,
      message: `Estado actualizado a ${newStatus}`,
    }
  } catch (error) {
    console.error("❌ Error al actualizar el estado de la orden:", error)
    return {
      success: false,
      message: 'Error al actualizar el estado de la orden',
    }
  }
}
