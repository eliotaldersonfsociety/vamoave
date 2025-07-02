"use server";

import db from "@/lib/db/productos/db";
import { productsTable, shippingServicesTable, NewProduct, NewShippingService } from "@/lib/products/schema";

// Definimos un tipo adaptado que acepta números en lugar de booleanos
type FrontendProduct = Omit<NewProduct, "id" | "status"> & {
  status: number;
};

interface InputProduct extends FrontendProduct {
  shipping_services: Omit<NewShippingService, "id" | "productId">[];
}

export const saveProduct = async (product: InputProduct) => {
  try {
    const [newProduct] = await db.insert(productsTable).values(product).returning();

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
