// lib/schema.ts
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const ordersTable = sqliteTable('orders', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  city: text('city'),
  department: text('department'),
  paymentMethod: text('payment_method').notNull(),
  shippingMethod: text('shipping_method').notNull(),
  shippingServiceName: text('shipping_service_name'),
  shippingServiceBalance: real('shipping_service_balance'),
  total: real('total').notNull(),
  status: text('status').default('pendiente'),
  createdAt: text('created_at').notNull(),
});

export const orderItemsTable = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id').notNull(),
  productId: integer('product_id').notNull(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
  image: text('image'),
  color: text('color'),
  size: text('size'),
  sizeRange: text('size_range'),
});
