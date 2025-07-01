"use client"

import type React from "react"
import { MobileNavigationSidebar } from "./app-sidebars"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayouts({ children }: DashboardLayoutProps) {
  return (
    <div>
      <MobileNavigationSidebar />
      <main >
        {children}
      </main>
    </div>
  )
}
