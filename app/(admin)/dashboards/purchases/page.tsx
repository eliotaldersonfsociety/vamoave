// app/panel/purchases/page.tsx
"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PurchasesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboards/purchases/cliente"); // Asegúrate de que esta ruta sea correcta
  }, [router]);
  return null;
}
