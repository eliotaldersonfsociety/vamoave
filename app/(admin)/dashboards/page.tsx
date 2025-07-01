import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTotalRevenue } from "@/app/helpers/getTotalRevenue";
import { getNumeroDeCompras } from "@/app/helpers/getNumeroDeCompras";
import { getEnviosPendientesCompras } from "@/app/helpers/getPendientesCompras";
import PanelPageClient from "./PanelPageClient";

export interface PanelPageClientProps {
  totalIngresos: number;
  numeroDeCompras: number;
  lastPurchaseDate: string | null;
  name: string;
  lastname: string;
  email: string;
  porcentajePendientes: number;
  comprasPendientes: number;
}

export default async function PanelPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const isAdmin = true;
  if (!isAdmin) return <div>No tienes acceso a este panel.</div>;

  const user = await currentUser();
  const name = user?.firstName ?? "";
  const lastname = user?.lastName ?? "";
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  const { numeroDeCompras, ultimaCompra } = await getNumeroDeCompras();
  const envios = await getEnviosPendientesCompras();
  const totalIngresos = await getTotalRevenue();

  return (
    <PanelPageClient
      totalIngresos={totalIngresos}
      numeroDeCompras={numeroDeCompras}
      lastPurchaseDate={ultimaCompra}
      name={name}
      lastname={lastname}
      email={email}
      porcentajePendientes={envios.porcentajePendientes}
      comprasPendientes={envios.pendientes}
    />
  );
}
