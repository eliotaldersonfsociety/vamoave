"use client";
import { useState } from 'react';
import { DashboardLayouts } from "@/components/dashboard-layouts";
import { Card } from "@/components/ui/card";
import { PurchaseDetailsModal } from "@/components/purchase-details-modal";
import { useRouter, useSearchParams } from "next/navigation";

export interface PurchaseItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  color: string | null;
  size: string | null;
  size_range: string | null;
}

export interface Purchase {
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
  items: PurchaseItem[];
}


interface Pagination {
  total: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export default function PurchasesClientPage({ initialPurchases }: { initialPurchases: { purchases: Purchase[]; pagination: Pagination } }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const { purchases, pagination } = initialPurchases;
  const router = useRouter();

  const openModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleStatusChange = (newStatus: string) => {
    console.log(`Cambiar estado a: ${newStatus}`);
  };

  const goToPage = (page: number) => {
    router.push(`/dashboards/purchases/cliente?page=${page}`);
    router.refresh(); // Esto fuerza a refetchear los datos del servidor
  };

  return (
    <>
      <div className="w-full bg-gray-100 min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 p-4 md:p-8">
      <Card>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Todas las Compras (Página {pagination.currentPage} de {pagination.totalPages})</h3>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50" onClick={() => openModal(purchase)}>
                      <td className="px-4 py-2">{purchase.name || purchase.email || '-'}</td>
                      <td className="px-4 py-2">#{purchase.id}</td>
                      <td className="px-4 py-2">{(purchase.items || []).map(i => i.name).join(', ') || 'Sin productos'}</td>
                      <td className="px-4 py-2">{purchase.status || 'Pendiente'}</td>
                      <td className="px-4 py-2 text-right">${parseFloat(String(purchase.total)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              Anterior
            </button>

            <span className="text-sm text-gray-700">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>

            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      </Card>

      {selectedPurchase && (
        <PurchaseDetailsModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          purchase={selectedPurchase}
          onStatusChange={handleStatusChange}
        />
      )}

      <DashboardLayouts>
        {/* Puedes agregar contenido adicional aquí si lo deseas */}
        <></>
      </DashboardLayouts>
    </div>
    </div>
    </>
  );
}
