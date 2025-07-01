"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { UserPlus, Smartphone, Package, Shirt, Dog } from "lucide-react";

const cards = [
  {
    title: 'Crea tu cuenta',
    icon: UserPlus,
    description: 'Disfruta de ofertas y compra sin límites',
    buttonText: 'Proximamente',
    path: "/login",
  },
  {
    title: 'Ropa',
    icon: Shirt,
    description: 'Encuentra el estilo que se adapta a ti',
    buttonText: 'Buscar Ropa',
    path: "/pages/categorias/moda"
  },
  {
    title: 'Celulares y teléfonos',
    icon: Smartphone,
    description: 'Descubre celulares que son tendencia',
    buttonText: 'Ir a celulares',
    path: "/pages/categorias/celulares"
  },
  {
    title: 'Mascotas',
    icon: Dog,
    description: 'Encuentra todo para tu mascota y más',
    buttonText: 'Ir a mascotas',
    path: "/pages/categorias/mascotas"
  },
  {
    title: 'Recibe tus compras',
    icon: Package,
    description: 'Retiras en la comodidad de tu casa',
    buttonText: 'Cómo recibir o retirar',
  },
];

export default function FeatureCards() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Velocidad de desplazamiento automático (px por frame)
  const scrollSpeed = 0.5;

  useEffect(() => {
    if (!autoScroll) return;

    let animationFrameId: number;

    const step = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        container.scrollLeft += scrollSpeed;

        // Si llegamos al final, volver al inicio para loop
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [autoScroll]);

  const scrollByCard = (direction: "left" | "right") => {
    setAutoScroll(false); // Pausar auto scroll cuando usan control

    if (containerRef.current) {
      const container = containerRef.current;
      const cardWidth = container.querySelector("div > div")?.clientWidth ?? 200;
      const scrollAmount = direction === "left" ? -cardWidth - 24 : cardWidth + 24; // 24 = espacio entre cards (gap)
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gray-200 py-12 overflow-hidden relative">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 p-4 md:p-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Botones de control */}
          <button
            onClick={() => scrollByCard("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-red-800 text-white p-2 rounded-full shadow-lg hover:bg-red-900 z-20"
            aria-label="Anterior"
          >
            &#8592;
          </button>
          <button
            onClick={() => scrollByCard("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-800 text-white p-2 rounded-full shadow-lg hover:bg-red-900 z-20"
            aria-label="Siguiente"
          >
            &#8594;
          </button>

          {/* Contenedor horizontal scroll (sin scrollbar visible) */}
          <div
            ref={containerRef}
            className="flex space-x-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
            onMouseEnter={() => setAutoScroll(false)}
            onMouseLeave={() => setAutoScroll(true)}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center min-w-[200px] flex-shrink-0 scroll-snap-align-start"
              >
                <card.icon className="w-12 h-12 text-red-800 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <button
                  type="button"
                  disabled={card.title === "Crea tu cuenta"}
                  onClick={() => card.path && router.push(card.path)}
                  className={`mt-auto px-4 py-2 rounded-full font-semibold transition-colors
                    ${card.title === "Crea tu cuenta"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-red-800 hover:bg-red-900 text-white"
                    }`}
                >
                  {card.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}