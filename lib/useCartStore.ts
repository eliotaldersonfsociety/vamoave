// store/useCartStore.ts
import { create } from 'zustand';
import Cookies from 'js-cookie';

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity?: number;
  status?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string | null;
  size?: string | null;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  handleAddToCart: (product: Product, quantity?: number) => void; // Nuevo método
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: typeof window !== "undefined" && Cookies.get("cart") ? JSON.parse(Cookies.get("cart")!) : [],

  // --- Método nuevo: handleAddToCart ---
  handleAddToCart: (product, quantity = 1) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      quantity,
    };

    set((state) => {
      const exist = state.cartItems.find(
        (i) => i.id === cartItem.id
      );

      let newCart;

      if (exist) {
        newCart = state.cartItems.map((i) =>
          i.id === cartItem.id
            ? { ...i, quantity: i.quantity + cartItem.quantity }
            : i
        );
      } else {
        newCart = [...state.cartItems, cartItem];
      }

      Cookies.set("cart", JSON.stringify(newCart), { expires: 7 });
      return { cartItems: newCart };
    });
  },

  // --- Funciones existentes ---
  addToCart: (cartItem) => {
    console.log("Producto a agregar:", cartItem);

    return set((state) => {
      const exist = state.cartItems.find(
        (i) =>
          i.id === cartItem.id &&
          i.size === cartItem.size &&
          i.color === cartItem.color
      );

      let newCart;

      if (exist) {
        newCart = state.cartItems.map((i) =>
          i.id === cartItem.id &&
          i.size === cartItem.size &&
          i.color === cartItem.color
            ? { ...i, quantity: i.quantity + cartItem.quantity }
            : i
        );
      } else {
        newCart = [...state.cartItems, cartItem];
      }

      Cookies.set("cart", JSON.stringify(newCart), { expires: 7 });
      return { cartItems: newCart };
    });
  },

  removeFromCart: (productId) => set((state) => {
    const item = state.cartItems.find(i => i.id === productId);
    let newCart;

    if (!item) return { cartItems: state.cartItems };

    if (item.quantity === 1) {
      newCart = state.cartItems.filter(i => i.id !== productId);
    } else {
      newCart = state.cartItems.map(i =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    }

    if (newCart.length === 0) {
      Cookies.remove("cart");
    } else {
      Cookies.set("cart", JSON.stringify(newCart), { expires: 7 });
    }

    return { cartItems: newCart };
  }),

  clearCart: () => {
    Cookies.remove("cart");
    set({ cartItems: [] });
  }
}));