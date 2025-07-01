//hooks/usePageView.ts
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function generateBrowserId() {
  return 'browser_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getBrowserId() {
  const storageKey = 'browser_id';
  let browserId = localStorage.getItem(storageKey);
  
  if (!browserId) {
    browserId = generateBrowserId();
    localStorage.setItem(storageKey, browserId);
  }
  
  return browserId;
}

// Verifica si estamos en una página de producto: /product/[id]
function isProductPage(pathname: string) {
  return /^\/product\/\d+$/.test(pathname);
}

export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isProductPage(pathname)) return;

    const browserId = getBrowserId();
    const tabId = Math.random().toString(36).substring(2);
    const sessionId = `${browserId}_${tabId}`;

    // Guardar visita
    if (typeof window !== "undefined") {
      const visitas = JSON.parse(localStorage.getItem("visitas") || "{}");

      visitas[pathname] = (visitas[pathname] || 0) + 1;
      localStorage.setItem("visitas", JSON.stringify(visitas));
    }

    // Actualizar usuarios activos locales
    if (typeof window !== "undefined") {
      const activeKey = "active-users";
      const timestamp = Date.now();
      const activeUsers = JSON.parse(localStorage.getItem(activeKey) || "{}");

      activeUsers[sessionId] = {
        pathname,
        timestamp
      };
      localStorage.setItem(activeKey, JSON.stringify(activeUsers));
    }

    // Mantener activo
    const interval = setInterval(() => {
      const activeUsers = JSON.parse(localStorage.getItem("active-users") || "{}");
      if (activeUsers[sessionId]) {
        activeUsers[sessionId].timestamp = Date.now();
        localStorage.setItem("active-users", JSON.stringify(activeUsers));
      }
    }, 30000);

    // Limpiar
    return () => {
      const activeUsers = JSON.parse(localStorage.getItem("active-users") || "{}");
      delete activeUsers[sessionId];
      localStorage.setItem("active-users", JSON.stringify(activeUsers));
      clearInterval(interval);
    };
  }, [pathname]);
}
