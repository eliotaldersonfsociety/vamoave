import Image from "next/image"

export default function Component() {
  const sections = [
    {
      title: "Innovación Tecnológica",
      description:
        "Descubre las últimas tendencias en tecnología que están transformando el mundo. Desde inteligencia artificial hasta blockchain, exploramos cómo estas innovaciones están cambiando la forma en que vivimos y trabajamos.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Diseño Centrado en el Usuario",
      description:
        "Creamos experiencias digitales excepcionales poniendo al usuario en el centro de cada decisión. Nuestro enfoque en UX/UI garantiza interfaces intuitivas y atractivas que conectan con tu audiencia.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Desarrollo Sostenible",
      description:
        "Comprometidos con el futuro del planeta, implementamos prácticas de desarrollo sostenible que minimizan el impacto ambiental mientras maximizamos la eficiencia y el rendimiento de nuestras soluciones.",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Colaboración Global",
      description:
        "Trabajamos con equipos distribuidos alrededor del mundo, aprovechando la diversidad de talentos y perspectivas para crear productos que trascienden fronteras y culturas, conectando personas globalmente.",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div className="w-full bg-white">
      {/* Título principal */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Transformando el Futuro Digital</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre cómo estamos revolucionando la industria tecnológica con soluciones innovadoras y sostenibles
        </p>
      </div>

      {/* Secciones alternadas */}
      <div className="container mx-auto px-4">
        {sections.map((section, index) => (
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
                    src={section.image || "/placeholder.svg"}
                    alt={section.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Contenido de texto */}
              <div className={`space-y-6 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="inline-block">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                    Sección {index + 1}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{section.title}</h2>

                <p className="text-lg text-gray-600 leading-relaxed">{section.description}</p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                    Saber Más
                  </button>
                  <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección final */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a miles de empresas que ya están transformando su futuro digital con nuestras soluciones
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-lg transition-colors duration-200">
            Comenzar Ahora
          </button>
        </div>
      </div>
    </div>
  )
}
