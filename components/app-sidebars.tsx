"use client"

import type React from "react"

import { useState } from "react"
import {
  Home,
  User,
  ShoppingBasket,
  Package,
  BadgeDollarSign,
  BarChart3,
  LogOut,
  CirclePlus,
  SquarePen,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function MobileNavigationSidebar() {
  const pathname = usePathname()
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false)

  const mainRoutes = [
    { id: "inicio", name: "Inicio", href: "/dashboards", icon: Home },
    { id: "compras", name: "Compras", href: "/dashboards/purchases", icon: ShoppingBasket },
    { id: "productos", name: "Productos", icon: Package, hasSubmenu: true },
    //{ id: "saldo", name: "Saldo", href: "/dashboards/saldo", icon: BadgeDollarSign },
    { id: "estadisticas", name: "Stats", href: "/dashboards/estadisticas", icon: BarChart3 },
  ]

  const productosSubmenu = [
    { name: "Crear Producto", href: "/dashboards/productos/new", icon: CirclePlus },
    { name: "Editar Productos", href: "/dashboards/productos", icon: SquarePen },
  ]

  const isActive = (path: string) => pathname === path
  const isRouteActive = (route: any) => {
    if (route.href) return isActive(route.href)
    if (route.id === "productos") {
      return pathname.includes("/dashboards/productos")
    }
    return false
  }

  const handleOpenClerkProfile = (e: React.MouseEvent) => {
    e.preventDefault()
    if (window.Clerk) {
      window.Clerk.openUserProfile()
    }
  }

  const handleProductsClick = () => {
    setShowProductsSubmenu(!showProductsSubmenu)
  }

  return (
    <>
      {/* Navegación principal unificada */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:static sm:p-6 sm:max-w-md sm:mx-auto">
        <div className="w-full max-w-[360px] mx-auto p-1 sm:p-6 sm:max-w-md sm:mx-auto backdrop-blur-lg bg-background/80 rounded-2xl shadow-sm border border-gray-100">

          {/* Barra de navegación principal */}
          <div className="flex justify-between items-center">
            {mainRoutes.map((route) => {
              const Icon = route.icon
              const active = isRouteActive(route)

              if (route.hasSubmenu) {
                return (
                  <button
                    key={route.id}
                    onClick={handleProductsClick}
                    className="flex flex-col items-center gap-1 p-2 relative group"
                  >
                    <div
                      className={`p-3 rounded-xl transition-all duration-200 ${
                        active || showProductsSubmenu ? "bg-blue-50" : "group-hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          active || showProductsSubmenu ? "text-black" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                        strokeWidth={active || showProductsSubmenu ? 2.5 : 2}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`hidden sm:inline text-xs ${
                          active || showProductsSubmenu
                            ? "text-black font-medium"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      >
                        {route.name}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          showProductsSubmenu ? "rotate-180" : ""
                        } ${
                          active || showProductsSubmenu ? "text-black" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                    </div>
                    {(active || showProductsSubmenu) && (
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black rounded-full" />
                    )}
                  </button>
                )
              }

              return (
                <Link key={route.id} href={route.href!} className="flex flex-col items-center gap-2 p-3 relative group">
                  <div
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      active ? "bg-blue-50" : "group-hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${active ? "text-black" : "text-gray-400 group-hover:text-gray-600"}`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  <span
                    className={`text-xs ${active ? "text-black font-medium" : "text-gray-400 group-hover:text-gray-600"}`}
                  >
                    {route.name}
                  </span>
                  {active && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-black rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Submenú de productos */}
          {showProductsSubmenu && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
              <div className="flex justify-center gap-8">
                {productosSubmenu.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex flex-col items-center gap-2 p-3 relative group"
                      onClick={() => setShowProductsSubmenu(false)}
                    >
                      <div
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          active ? "bg-green-50" : "group-hover:bg-gray-50"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${active ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}`}
                          strokeWidth={active ? 2.5 : 2}
                        />
                      </div>
                      <span
                        className={`text-xs text-center ${
                          active ? "text-green-600 font-medium" : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      >
                        {item.name}
                      </span>
                      {active && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-600 rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
