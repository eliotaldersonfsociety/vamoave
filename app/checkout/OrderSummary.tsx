import React from 'react';
import Image from 'next/image';

interface CartItem {
  id: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  color?: string | null;
  size?: string | null;
  sizeRange?: number | null;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  totalPrice: number;
  shippingService?: { name: string; balance: number } | null;
  currency?: string;
}

const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  totalPrice,
  shippingService = null,
  currency = "USD",
}) => {
  const shippingCost = shippingService?.balance ?? 0;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="lg:w-2/5 bg-gray-100 p-4 md:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
      <div className="max-w-md mx-auto lg:sticky top-8">
        <h2 className="text-lg font-semibold mb-6">Resumen del pedido</h2>
        
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 py-8">Tu carrito está vacío.</p>
        ) : (
          <>
            {/* Productos */}
            <div className="max-h-[40vh] overflow-y-auto pr-2 mb-4 border-b pb-2 space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-white rounded border flex items-center justify-center overflow-hidden">
                      <Image
                        loader={imageLoader}
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    {(item.color || item.size || item.sizeRange) && (
                      <p className="text-xs text-gray-500 truncate">
                        {item.color ? `Color: ${item.color}` : ''}
                        {item.color && (item.size || item.sizeRange) ? ' / ' : ''}
                        {item.size ? `Talla: ${item.size}` : ''}
                        {item.sizeRange ? `Rango: ${item.sizeRange}` : ''}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen de costos */}
            <div className="space-y-1 border-b pb-3 mb-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-medium text-green-600">
                  {shippingService ? `${shippingService.name}` : "No seleccionado"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Costo de envío</span>
                <span className="font-medium">
                  {shippingService && shippingService.balance > 0
                    ? `$${shippingService.balance.toFixed(2)}`
                    : "Gratis"}
                </span>
              </div>
            </div>

            {/* Total final */}
            <div className="flex justify-between items-center text-lg font-bold pt-1">
              <span>Total</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{currency}</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};