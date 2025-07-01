import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Tabla de productos
export const productsTable = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(''),
  price: real("price").notNull(),
  compare_at_price: real("compare_at_price"),
  cost_per_item: real("cost_per_item"),
  vendor: text("vendor"),
  product_type: text("product_type"),
  status: integer("status").notNull().default(1),
  category: text("category"),
  tags: text("tags"),
  sku: text("sku"),
  barcode: text("barcode"),
  quantity: integer("quantity").notNull().default(0),
  track_inventory: integer("track_inventory", { mode: "boolean" }).default(false),
  images: text("images", { mode: "json" }).notNull().default([]),
  sizes: text("sizes", { mode: "json" }).notNull().default([]),
  size_range: text("size_range", { mode: "json" }).notNull(),
  colors: text("colors", { mode: "json" }).notNull().default([]),
});

// Tabla de servicios de envío
export const shippingServicesTable = sqliteTable("shipping_services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => productsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  balance: real("balance").notNull(),
});

// Relaciones
export const productsRelations = relations(productsTable, ({ many }) => ({
  shippingServices: many(shippingServicesTable),
}));

export const shippingServicesRelations = relations(shippingServicesTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [shippingServicesTable.productId],
    references: [productsTable.id],
  }),
}));

// Tipos para TypeScript
export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;
export type ShippingService = typeof shippingServicesTable.$inferSelect;
export type NewShippingService = typeof shippingServicesTable.$inferInsert;
