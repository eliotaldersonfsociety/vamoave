"use client";

import Image from "next/image";
import { Product } from "@/types/productos";

// Loader personalizado para imágenes externas
const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

// Frases de incentivo a la compra
const actionPhrases = [
  "Compra 100% segura",
  "Pídelo y pagas en tu casa",
  "¡Quedan pocas unidades!",
];

export default function LandingPage({ product }: { product: Product }) {
  const landingData = product.landingpage;

  if (!landingData || !landingData.titles.length) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No hay datos de landing disponibles.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Título principal */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">{landingData.titles[0]}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{landingData.texts[0]}</p>
      </div>

      {/* Secciones dinámicas */}
      <div className="container mx-auto px-4">
        {landingData.titles.slice(1).map((title, index) => {
          const imageIndex = index % (product.images?.length || 1);
          const imageUrl = product.images?.[imageIndex] || "/placeholder.svg?height=400&width=600";
          const actionText = actionPhrases[index % actionPhrases.length];

          return (
            <div key={index} className="py-16">
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 0 ? "lg:grid-flow-col" : "lg:grid-flow-col-dense"
                }`}
              >
                {/* Imagen */}
                <div className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <Image
                      src={imageUrl}
                      alt={`Imagen sección ${index + 1}`}
                      width={600}
                      height={400}
                      loader={customLoader}
                      className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Contenido de texto */}
                <div className={`space-y-6 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="inline-block">
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                      {actionText}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h2>

                  <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    {landingData.texts[index + 1]}
                  </p>

                  <div className="pt-4">
                    <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sección final */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{landingData.callToAction}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Miles ya aprovecharon estas ofertas… ¿y tú, qué esperas?
          </p>
          <button className="bg-red-800 hover:bg-red-900 text-white font-bold py-4 px-12 rounded-lg text-lg transition-colors duration-200">
            Pide el tuyo
          </button>
        </div>
      </div>
    </div>
  );
}
