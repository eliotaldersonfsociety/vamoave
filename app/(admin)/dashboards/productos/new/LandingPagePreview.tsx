"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface LandingData {
  titles: string[];
  texts: string[];
  callToAction: string;
}

// Loader personalizado para evitar error de dominio no autorizado
const customLoader = ({ src }: { src: string }) => {
  return src;
};

export default function LandingPagePreview({
  productTitle,
  productCategory,
  productImages = [],
}: {
  productTitle: string;
  productCategory: string;
  productImages: string[];
}) {
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar desde localStorage si ya se generó antes
  useEffect(() => {
    const saved = localStorage.getItem("generated_landing");
    if (saved) {
      try {
        setLandingData(JSON.parse(saved));
      } catch (e) {
        console.error("Error al parsear datos guardados.");
      }
    }
  }, []);

  const generateLandingTexts = async () => {
    if (!productTitle || !productCategory) {
      toast({
        title: "Datos incompletos",
        description: "Por favor ingresa un título y categoría antes de generar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/landingpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: productTitle, category: productCategory }),
      });

      if (!res.ok) throw new Error("Error generando contenido");

      const data = await res.json();
      setLandingData(data);
      localStorage.setItem("generated_landing", JSON.stringify(data));

      toast({
        title: "Contenido generado",
        description: "Tu landing page está lista para ver.",
      });
    } catch (error) {
      console.error("Error al generar landing:", error);
      toast({
        title: "Error generando la landing",
        description: "Hubo un problema con la IA.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Previsualización Landing Page</h2>

      {landingData ? (
        <div className="space-y-8">
          {/* Sección principal */}
          <section className="text-center py-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{landingData.titles[0]}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{landingData.texts[0]}</p>
          </section>

          {/* Secciones dinámicas */}
          <div className="space-y-12">
            {landingData.titles.slice(1).map((title, index) => (
              <section key={index} className="py-8 grid lg:grid-cols-2 gap-10 items-center">
                {/* Imagen */}
                <div className="relative">
                  {productImages.length > 0 ? (
                    <Image
                      loader={customLoader}
                      src={productImages[index % productImages.length]}
                      alt={`Imagen ${title}`}
                      width={600}
                      height={400}
                      className="rounded-lg shadow-md object-cover w-full h-auto"
                    />
                  ) : (
                    <div className="bg-gray-100 rounded-lg flex items-center justify-center h-48">
                      <p className="text-gray-500">Sin imagen disponible</p>
                    </div>
                  )}
                </div>

                {/* Texto */}
                <div className="space-y-4">
                  <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    Sección {index + 1}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {landingData.texts[index + 1]}
                  </p>
                </div>
              </section>
            ))}
          </div>

          {/* Llamado a la acción */}
          <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{landingData.callToAction}</h3>
            <button className="mt-4 bg-white text-blue-600 hover:bg-blue-50 transition-colors px-6 py-3 rounded-lg font-semibold shadow-md">
              Comprar Ahora →
            </button>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <p className="text-gray-500">No se ha generado contenido aún.</p>
          <button
            onClick={generateLandingTexts}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:bg-blue-300"
          >
            {loading ? "Generando..." : "Generar Contenido para Landing"}
          </button>
        </div>
      )}
    </div>
  );
}