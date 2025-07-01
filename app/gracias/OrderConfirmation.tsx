'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import useRoleRedirect from "@/hooks/useOrganization";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string | null;
  color?: string | null;
  size?: string | null;
  sizeRange?: string | null;
}

interface OrderDetails {
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
  items: OrderItem[];
}

interface Props {
  order: OrderDetails;
}

export default function OrderConfirmationClient({ order }: Props) {
  const { user } = useUser();
  const roleRedirect = useRoleRedirect();

  const envio = order.shippingServiceBalance || 0;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = order.total + envio;
  const status = 'approved';


  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col items-center text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
        <h1 className="text-3xl font-bold mb-2">Transacción Aprobada</h1>
        <p className="text-lg text-gray-600 mb-1">¡Gracias, {order.name || user?.firstName || 'cliente'}!</p>
        <p className="text-gray-600">Tu pedido está confirmado</p>
        <p className="text-sm text-gray-500 mt-2">Confirmación N°{order.id}</p>
        <p className="text-sm text-gray-500">Recibirás un correo electrónico con los detalles.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ubicación de entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.address}</p>
              <p>{order.city}, {order.department}</p>
              <p>{order.phone}</p>
              <div className="mt-4 w-full h-64 rounded overflow-hidden border">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${order.address}, ${order.city}, ${order.department}`)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de entrega"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4">Detalles del pedido</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Información de contacto</h3>
                <p>{order.name}</p>
                <p>{order.email}</p>
                <p>{order.phone}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Dirección de envío</h3>
                <p>{order.address}</p>
                <p>{order.city}, {order.department}</p>
                <p>{order.phone}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Método de envío</h3>
                <p>{order.shippingServiceName || order.shippingMethod}</p>
              </div>
              <Separator />
              <div className="mt-8">
                <p className="text-gray-600">¿Necesitas ayuda? Ponte en contacto con nosotros</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Artículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    {item.image && (
                      <div className="relative w-20 h-20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                      {item.size && <p className="text-sm text-gray-500">Talla: {item.size}</p>}
                      {item.sizeRange && <p className="text-sm text-gray-500">Rango de talla: {item.sizeRange}</p>}
                    </div>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  {envio > 0 && (
                    <div className="flex justify-between">
                      <p className="text-gray-600">Envío</p>
                      <p>${envio.toFixed(2)}</p>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 space-x-4 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/">Seguir comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
