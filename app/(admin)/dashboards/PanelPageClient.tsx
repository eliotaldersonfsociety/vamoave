'use client';

import React from 'react';
import { DashboardLayouts } from '@/components/dashboard-layouts';

interface PanelPageClientProps {
  name: string;
  lastname: string;
  email: string;
  totalIngresos: number;
  numeroDeCompras: number;
  lastPurchaseDate: string | null; // Fecha de la última compra, puede ser null si no hay compras
  porcentajePendientes: number; // Porcentaje de envíos pendientes
  comprasPendientes: number;
}

const PanelPageClient: React.FC<PanelPageClientProps> = ({
  name,
  lastname,
  email,
  totalIngresos,
  numeroDeCompras,
  lastPurchaseDate = null, // Fecha de la última compra, puede ser null si no hay compras
  porcentajePendientes,
  comprasPendientes,
}) => {
  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 p-4 md:p-8">
        {/* Cards principales */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Ingresos Globales */}
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between pb-2">
              <div className="text-sm font-medium">Ingresos Globales:</div>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              ${totalIngresos.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </div>
          </div>

          {/* Numero de Compras */}
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between pb-2">
              <div className="text-sm font-medium">Numero de Compras:</div>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {numeroDeCompras}
            </div>
            <div className="text-xs text-muted-foreground">
              Fecha de la ultima compra: {lastPurchaseDate ? new Date(lastPurchaseDate).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          {/* Productos por enviar */}
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between pb-2">
              <div className="text-sm font-medium">Productos por enviar:</div>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {comprasPendientes}
            </div>
            <div className="text-xs text-muted-foreground">
              El % de envios pendientes: {porcentajePendientes.toFixed(2)}%
            </div>
          </div>

          {/* Administrador */}
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between pb-2">
              <div className="text-sm font-medium">Administrador:</div>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{name}</div>
            <div className="text-xs text-muted-foreground">{lastname}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold">Bienvenido a tu Panel</h2>
            <p className="mt-2 text-muted-foreground">
              {name}, aquí podrás gestionar a los usuarios, revisar sus compras,
              recargar saldo y más. Utiliza el menú lateral para navegar.
            </p>
          </div>
        </div>

        {/* Sección inferior opcional */}
        <DashboardLayouts>
          <></>
        </DashboardLayouts>
      </div>
    </div>
  );
};

export default PanelPageClient;
