export type ProductForm = {
  title: string;
  description: string;
  price: string;
  compare: string;
  cost_per_item: string;
  vendor: string;
  type: string;
  status: boolean;
  category: string;
  tags: string;
  sku: string;
  barcode: string;
  quantity: number;
  track: boolean;
  images: string[];
  sizes: string[];
  range: { min: number; max: number };
  colors: string[];
  shipping_services: { name: string; balance: number }[];
};

// types.ts
export interface ShippingService {
  name: string;
  balance: number;
}

export interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number | string;
  compare: string | number | null;
  cost_per_item: string | number | null;
  vendor: string | null;
  type: string | null;
  status: boolean | null;
  category: string | null;
  tags: string | string[] | null;
  sku: string | null;
  barcode: string | null;
  quantity: number | null;
  track: boolean | null;
  images: string[] | null;
  sizes: string[] | null;
  range: { min: number; max: number } | null;
  colors: string[] | null;
  shipping_services: { name: string; balance: number }[];
}

export interface DeliveryInfo {
  name: string;
  address: string;
  phone: string;
  city: string;
  department: string;
  email: string;

}

export interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  image?: string | string[];
  color?: string;
  size?: string;
  sizeRange?: string;
  shipping_services?: ShippingService[];
}

// Props del componente
export interface ShippingMethodProps {
  shippingMethod: string;
  setShippingMethod: (value: string) => void;
  services: ShippingService[];
  isProcessing?: boolean;
};

export interface CartState {
  cartItems: CartItem[];
  addToCart: (p: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}
