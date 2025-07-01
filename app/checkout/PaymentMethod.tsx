'use client';

import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  isProcessing: boolean;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  setPaymentMethod,
  isProcessing,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Pago</h2>
      <p className="text-sm text-gray-600 mb-4">Pago contra entrega.</p>

      <RadioGroup
        value={paymentMethod}
        onValueChange={setPaymentMethod}
        className="mb-8 space-y-2"
        disabled={isProcessing}
      >
        <Label
          htmlFor="contra-entrega"
          className={`border rounded-md p-4 flex justify-between items-center cursor-pointer transition-colors duration-150 ${
            paymentMethod === "contra-entrega"
              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-300"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem id="contra-entrega" value="contra-entrega" />
            <div>
              <span>Pagar contra entrega</span>
              <span className="text-xs block text-gray-500">
                (Recibes y pagas en tu casa)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <img src="/pago.png" alt="Pago" className="h-5" />
          </div>
        </Label>
      </RadioGroup>

      {paymentMethod === "contra-entrega" && (
        <div className="border-t-0 rounded-b-md px-4 py-2 bg-gray-50 text-sm text-gray-600 -mt-2">
          Una vez realices tu pedido, nos comunicaremos contigo por WhatsApp para confirmar todos los detalles..
        </div>
      )}
    </div>
  );
};
