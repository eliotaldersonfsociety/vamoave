"use server";

import db from "@/lib/db/productos/db";
import { productsTable, shippingServicesTable, NewProduct, NewShippingService } from "@/lib/products/schema";
import { sql } from "drizzle-orm";

// Definimos tipos correctamente
type FrontendProduct = Omit<NewProduct, "id" | "status"> & {
  status: number;
};

interface InputProduct extends FrontendProduct {
  shipping_services: Omit<NewShippingService, "id" | "productId">[];
}

export const saveProduct = async (product: InputProduct) => {
  try {
    // Insertamos el producto asegurándonos de convertir `status` adecuadamente
    const [newProduct] = await db.insert(productsTable)
      .values({
        ...product,
        status: sql<number>`${product.status}`, // ✅ Conversión correcta
        landingpage: product.landingpage ? sql<string>`CAST(${product.landingpage} AS TEXT)` : null,
      })
      .returning();

    // Insertamos servicios de envío
    const servicesToInsert: NewShippingService[] = product.shipping_services.map(service => ({
      name: service.name,
      balance: service.balance,
      productId: newProduct.id,
    }));

    await db.insert(shippingServicesTable).values(servicesToInsert);

    return { success: true, product: newProduct };
  } catch (error: any) {
    console.error("Error al guardar el producto:", error);
    return { success: false, error: error.message };
  }
};
