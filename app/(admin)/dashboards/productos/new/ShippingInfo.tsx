import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ProductForm } from "@/types/productos"; // Asegúrate de importar el tipo correcto

const shippingOptions = [
  { name: "Servientrega", value: "servientrega" },
  { name: "Interrapidisimo", value: "interrapidisimo" },
  { name: "Veloces", value: "veloces" },
  { name: "Envía", value: "envia" },
  { name: "Coordinadora", value: "coordinadora" },
  { name: "99 Minutos", value: "99minutos" },
  { name: "Futura", value: "futura" },
  { name: "TCC", value: "tcc" },
];

interface ShippingInfoProps {
  product: ProductForm;
  setProduct: React.Dispatch<React.SetStateAction<ProductForm>>;
}

export default function ShippingInfo({ product, setProduct }: ShippingInfoProps) {
  const handleShippingToggle = (service: string) => {
    setProduct((prev) => {
      const existingServiceIndex = prev.shipping_services.findIndex((s) => s.name === service);
      if (existingServiceIndex !== -1) {
        return {
          ...prev,
          shipping_services: prev.shipping_services.filter((_, i) => i !== existingServiceIndex),
        };
      } else {
        return {
          ...prev,
          shipping_services: [...prev.shipping_services, { name: service, balance: 0 }],
        };
      }
    });
  };

  const handleBalanceChange = (service: string, balance: number) => {
    setProduct((prev) => ({
      ...prev,
      shipping_services: prev.shipping_services.map((s) =>
        s.name === service ? { ...s, balance } : s
      ),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Envíos</CardTitle>
        <CardDescription>Selecciona los servicios de envío disponibles para este producto.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Servicios de Envío</Label>
          <div className="grid grid-cols-2 gap-4">
            {shippingOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Switch
                  id={option.value}
                  checked={product.shipping_services.some((s) => s.name === option.value)}
                  onCheckedChange={() => handleShippingToggle(option.value)}
                />
                <Label htmlFor={option.value}>{option.name}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Saldo de Envíos</Label>
          {product.shipping_services.map((service) => (
            <div key={service.name} className="flex items-center space-x-2">
              <Label htmlFor={`${service.name}-balance`}>{service.name} Saldo:</Label>
              <Input
                id={`${service.name}-balance`}
                type="number"
                value={service.balance}
                onChange={(e) => handleBalanceChange(service.name, parseFloat(e.target.value) || 0)}
                placeholder="Saldo"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
