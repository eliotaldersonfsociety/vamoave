// app/gracias/page.tsx
import { getOrderDetails } from '@/app/helpers/getOrderDetails';
import OrderConfirmationClient from './OrderConfirmation';

interface PageProps {
  searchParams?: Promise<{ pedido?: string }>;
}

export default async function GraciasPage({ searchParams }: PageProps) {
  const orderId = (await searchParams)?.pedido;

  if (!orderId) {
    return <div className="p-8 text-center text-red-500">No se proporcionó un ID de pedido</div>;
  }

  try {
    const order = await getOrderDetails(orderId);
    return <OrderConfirmationClient order={order} />;
  } catch (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error al obtener la información del pedido: {(error as Error).message}
      </div>
    );
  }
}