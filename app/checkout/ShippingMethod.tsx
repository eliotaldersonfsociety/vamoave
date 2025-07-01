"use client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product, ShippingService, ShippingMethodProps } from "@/types/productos";

// Función auxiliar para calcular días estimados
const getEstimatedDeliveryTime = (serviceName: string): number => {
  const times: Record<string, number> = {
    servientrega: 3,
    interrapidisimo: 2,
    veloces: 4,
    envia: 3,
    coordinadora: 5,
    "99minutos": 1,
    futura: 4,
    tcc: 5,
  };
  return times[serviceName] || 3;
};

export const ShippingMethod: React.FC<ShippingMethodProps> = ({
  shippingMethod,
  setShippingMethod,
  services,
  isProcessing = false,
}) => {
  console.log("🚚 Servicios de envío recibidos:", services);
  return (
    <div className="mb-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="shipping-method">
          <AccordionTrigger className="text-xl font-bold mb-4">
            Método de envío
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600 mb-4 mt-2">
              Selecciona la opción de envío que prefieras.
            </p>

            {services.length > 0 ? (
            <>
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
                className="mb-8 space-y-4"
                disabled={isProcessing}
              >
                {services.map((service) => (
                  <div
                    key={service.name}
                    className={`border rounded-md p-4 flex justify-between items-center cursor-pointer transition-colors duration-150 ${
                      shippingMethod === service.name
                        ? "bg-green-50 border-green-500 ring-2 ring-green-300"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <label className="flex items-center gap-3 w-full cursor-pointer">
                      <RadioGroupItem value={service.name} />
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-8 relative">
                          <img
                            src={`/${service.name}.png`}
                            alt={`Logo ${service.name}`}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <span className="ml-auto font-medium text-green-600">
                        {service.balance > 0 ? `$${service.balance}` : "Gratis"}
                      </span>
                    </label>
                  </div>
                ))}
              </RadioGroup>

              {shippingMethod && (
                <div className="mt-4 border-t-0 rounded-b-md px-4 py-2 bg-gray-50 text-sm text-gray-600">
                  Tu pedido será enviado por <strong>{shippingMethod}</strong>. Entrega estimada en{" "}
                  {getEstimatedDeliveryTime(shippingMethod)} días hábiles.
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">
              No hay servicios de envío disponibles para este producto.
            </p>
          )}

          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};