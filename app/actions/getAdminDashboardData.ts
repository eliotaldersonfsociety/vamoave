'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { eq, desc, sql } from 'drizzle-orm';
import db from '@/lib/db/index';
import { wishlist } from '@/lib/wishlist/schema';
import { getVisitasStats } from "@/app/helpers/getVisitasStats";
import { epaycoOrders } from '@/lib/epayco/schema';

export async function getAdminDashboardData() {
  const { userId } = await auth();
  console.log("USER ID DESDE SERVER:", userId);

  if (!userId) throw new Error('No autorizado');

  const user = await currentUser();
  const name = user?.firstName ?? '';
  const lastname = user?.lastName ?? '';
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '';

  // ✅ 1. Wishlist del usuario
  const wishlistItems = await db.wishlist
    .select()
    .from(wishlist)
    .where(eq(wishlist.userId, userId));
  const wishlistCount = wishlistItems.length;

  // ✅ 2. Órdenes filtradas por usuario y status APPROVED
  interface EpaycoOrder {
    status: string;
    updated_at: string;
    amount: number | string;
    clerk_id: string;
    [key: string]: any;
  }

  const approvedOrders: EpaycoOrder[] = (
    await db.epayco
      .select()
      .from(epaycoOrders)
      .where(eq(epaycoOrders.clerk_id, userId))
      .then((all: EpaycoOrder[]) =>
        all.filter((order: EpaycoOrder) => order.status === 'APPROVED')
      )
  ).sort((a: EpaycoOrder, b: EpaycoOrder) => {
    const aDate = new Date(a.updated_at).getTime();
    const bDate = new Date(b.updated_at).getTime();
    return bDate - aDate;
  });

  console.log("✅ Compras Aprobadas:", approvedOrders);

  const numeroDeCompras = approvedOrders.length;
  interface ApprovedOrder {
    status: string;
    updated_at: string;
    amount: number | string;
    [key: string]: any;
  }

  const balance = approvedOrders.reduce(
    (sum: number, t: ApprovedOrder) => sum + Number(t.amount),
    0
  );

  // ✅ 3. Fecha de última compra aprobada
  let lastPurchaseDate: string | null = null;
  const rawUpdatedAt = approvedOrders[0]?.updated_at;

  if (typeof rawUpdatedAt === 'string') {
    try {
      lastPurchaseDate = new Date(rawUpdatedAt).toISOString();
    } catch {
      console.warn('⚠️ Fecha ISO inválida:', rawUpdatedAt);
    }
  }

  console.log("✅ Número de compras:", numeroDeCompras);
  console.log("✅ Balance (solo aprobadas):", balance);
  console.log("✅ Última compra aprobada:", lastPurchaseDate);

 // ✅ 4. Visitas totales
const { total: visits } = await getVisitasStats();

console.log("✅ Total de visitas registradas:", visits);


  return {
    wishlistCount,
    balance,
    numeroDeCompras,
    lastPurchaseDate,
    visits,
  };
}
