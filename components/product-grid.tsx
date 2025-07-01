"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Product } from "@/lib/products/schema"; // Asegúrate de que este import sea correcto



interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCartStore();

  const handleAddToCart = (productId: number) => {
    const productToAdd = products.find((p) => p.id === productId);

    if (!productToAdd || !productToAdd.status || productToAdd.quantity <= 0) return;

    const cartItem = {
      id: productToAdd.id,
      name: productToAdd.title,
      price: productToAdd.price,
      image: (productToAdd.images as string[])[0] || "/placeholder.svg",
      quantity: 1,
      color: null,
      size: null,
      sizeRange: null,
      shipping_services: [],
    };

    addToCart(cartItem);

    toast.success(`✅ ${productToAdd.title} agregado al carrito`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div id="product-list" className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lista de Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
              <div className="relative h-48 w-full bg-gray-100 animate-pulse"></div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                <div className="mt-auto flex justify-between items-center">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
            >
              <div className="relative h-48 w-full bg-gray-100">
                {Array.isArray(product.images) && product.images.length > 0 ? (
                  <Image
                    loader={({ src }) => src}
                    src={product.images[0] || "/placeholder.svg"}
                    alt={`Imagen de ${product.title}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Imagen no disponible</div>
                )}

                {/* Botón carrito - esquina superior derecha */}
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.status || product.quantity <= 0}
                  className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md transition-transform hover:scale-105 ${
                    !product.status || product.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Agregar al carrito"
                >
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </button>

                {/* Stock - esquina superior izquierda */}
                <Badge className="absolute top-2 left-2 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                  <ShoppingCart className="w-4 h-4" />
                  Stock: {product.quantity ?? 0}
                </Badge>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h2 className="font-semibold text-lg mb-1 line-clamp-1">{product.title}</h2>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                    <p className={`text-sm ${product.status ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                      {product.status ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Inactivo
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/product/${product.id}`} passHref>
                      <button className="bg-red-800 hover:bg-red-900 transition-colors text-white px-3 py-1.5 rounded text-sm">
                        Ver Producto
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
