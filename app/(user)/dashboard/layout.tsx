import type React from "react"
import "@/app/globals.css"
import "./dashboard-variables.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
