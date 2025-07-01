"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col md:flex-row w-full h-auto md:h-[500px]">
        {/* Sección de imagen (izquierda) */}
        <div className="relative w-full md:w-1/2 h-[300px] md:h-full">
          <img
            src="/banner7.webp"
            alt="Woman opening a package from Tienda Texas - Aprovecha envío gratis en tu primera compra"
            className="object-cover w-full h-full"
          />
          {/* Overlay con degradado: solo md+ */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-gray-200" />
        </div>

        {/* Sección de texto con fondo de imagen (derecha) */}
        <div
          className="relative flex items-center justify-center w-full md:w-1/2 bg-cover bg-[center_top_40%] md:bg-center p-6 md:p-12"
          style={{ backgroundImage: "url('/banner77.webp')" }}
        >
          {/* Overlay con degradado */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-gray-200 z-0" />

          {/* Contenido encima del overlay */}
          <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-lg p-6 md:p-10 max-w-xl text-white text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl mb-2">
              <span className="font-bold">ENVÍO GRATIS</span>
              <br />
              <span className="font-extralight">EN TU PRIMERA COMPRA</span>
            </h1>
            <p className="mt-4 mb-6 text-lg md:text-xl font-light">
              Descubre nuestra selección de productos de calidad y aprovecha esta oferta especial en tu primera compra con envío gratuito.
            </p>
            <Link href="#product-list" passHref>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Comprar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
