'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface DeliveryInfo {
  name: string;
  address: string;
  phone: string;
  city: string;
  department: string;
  email: string;
}

interface DeliveryInfoFormProps {
  deliveryInfo: DeliveryInfo;
  handleDeliveryInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isProcessing: boolean;
}

export const DeliveryInfoForm: React.FC<DeliveryInfoFormProps> = ({
  deliveryInfo,
  handleDeliveryInfoChange,
  isProcessing,
}) => {
  return (
    <Accordion type="single" collapsible className="mb-6">
      <AccordionItem value="delivery">
        <AccordionTrigger className="text-xl font-bold mb-4">
          Información de Entrega
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block mb-2">Nombre y Apellido</label>
              <input
                type="text"
                name="name"
                value={deliveryInfo.name}
                onChange={handleDeliveryInfoChange}
                className="w-full p-2 border rounded"
                disabled={isProcessing}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Dirección</label>
              <input
                type="text"
                name="address"
                value={deliveryInfo.address}
                onChange={handleDeliveryInfoChange}
                className="w-full p-2 border rounded"
                disabled={isProcessing}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Ciudad</label>
              <input
                type="text"
                name="city"
                value={deliveryInfo.city}
                onChange={handleDeliveryInfoChange}
                className="w-full p-2 border rounded"
                disabled={isProcessing}
                required
              />
              <div>
              <label className="block mb-2">Departamento</label>
              <input
                type="text"
                name="department"
                value={deliveryInfo.department}
                onChange={handleDeliveryInfoChange}
                className="w-full p-2 border rounded"
                disabled={isProcessing}
                required
              />
            </div>

            <div>
              <label className="block mb-2">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={deliveryInfo.phone}
                onChange={handleDeliveryInfoChange}
                className="w-full p-2 border rounded"
                disabled={isProcessing}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Correo Electronico</label>
              <input
                type="email"
                name="email"
                value={deliveryInfo.email}
                onChange={handleDeliveryInfoChange}
                className="w-full p-2 border rounded"
                disabled={isProcessing}
                required
              />
            </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
