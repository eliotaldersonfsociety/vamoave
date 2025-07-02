// components/header/hot-products-banner.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cartStore";

// Importa el tipo ya definido
import { Product } from "@/app/helpers/getHotProducts";

const customLoader = ({ src }: { src: string }) => src;

export default function HotProductsBanner({ hotProducts }: { hotProducts: Product[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = (product: Product) => {
    if (!product || !product.id || !product.title || !product.price) return;

    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      quantity: 1,
    });
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full py-1.5 text-sm font-medium bg-gradient-to-r from-[#282c31] to-[#282c40] text-white transition-colors duration-200"
      >
        <Flame className="h-4 w-4 mr-2" />
        Lo más hot
        <ChevronDown
          className={`h-4 w-4 ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`w-full bg-black/95 backdrop-blur-md text-white overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100 py-6 md:py-8" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="container mx-auto px-4">
          {hotProducts.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No se encontraron productos calientes.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/10 hover:bg-white/20 transition-colors duration-200 rounded-lg p-3 flex flex-col cursor-pointer"
                >
                  <div className="relative mb-2 aspect-square w-full">
                    <Image
                      loader={customLoader}
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-1 py-0.5">
                      Hot
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="font-bold text-base">${(product.price ?? 0).toFixed(2)}</span>
                    <Button
                      size="sm"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
