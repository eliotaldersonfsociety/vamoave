'use server';

import db from '@/lib/db/productos/db';
import { ordersTable } from '@/lib/ordenes/schema';
import { count, eq } from 'drizzle-orm';

export interface EnviosStats {
  total: number;
  pendientes: number;
  porcentajePendientes: number;
  ordenesPendientes: {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    address: string;
    city: string | null;
    department: string | null;
    paymentMethod: string;
    shippingMethod: string;
    shippingServiceName: string | null;
    shippingServiceBalance: number | null;
    total: number;
    status: string | null;
    createdAt: string;
  }[];
}

export async function getEnviosPendientesCompras(): Promise<EnviosStats> {
  // Total de órdenes
  const totalResult = await db
    .select({ total: count() })
    .from(ordersTable);

  // Total de órdenes con status "pendiente"
  const pendientesResult = await db
    .select({ pendientes: count() })
    .from(ordersTable)
    .where(eq(ordersTable.status, 'pendiente'));

  // Órdenes pendientes completas
  const ordenesPendientes = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.status, 'pendiente'));

  // Conversión segura a número
  const total = Number(totalResult[0]?.total ?? 0);
  const pendientes = Number(pendientesResult[0]?.pendientes ?? 0);
  const porcentajePendientes = total > 0 ? (pendientes / total) * 100 : 0;

  // Log para depuración
  console.log("Total órdenes:", total);
  console.log("Órdenes pendientes:", pendientes);
  console.log("Porcentaje de pendientes:", porcentajePendientes.toFixed(2));

  return {
    total,
    pendientes,
    porcentajePendientes: parseFloat(porcentajePendientes.toFixed(2)),
    ordenesPendientes,
  };
}
