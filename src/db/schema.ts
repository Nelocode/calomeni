import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Usuarios de la administración
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
});

// Sesiones activas de usuarios (autenticación manual)
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(), // Timestamp ms
});

// Contenido estático y dinámico (Páginas y Entradas de Blog)
export const postsPages = sqliteTable('posts_pages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(), // Contenido JSON de TipTap o HTML
  type: text('type').notNull(), // 'page' | 'post'
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  published: integer('published').notNull().default(0), // 0 = Draft, 1 = Published
  createdAt: integer('created_at').notNull(), // Timestamp ms
  updatedAt: integer('updated_at').notNull(), // Timestamp ms
});

// Catálogo de Productos
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  images: text('images').notNull().default('[]'), // Array JSON de URLs de imágenes
  published: integer('published').notNull().default(0), // 0 = Draft, 1 = Published
  createdAt: integer('created_at').notNull(), // Timestamp ms
  updatedAt: integer('updated_at').notNull(), // Timestamp ms
});

// Órdenes de Compra (E-commerce)
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'paid' | 'shipped' | 'cancelled'
  total: real('total').notNull(),
  items: text('items').notNull(), // Array JSON de items: { productId, name, price, quantity }
  paymentProvider: text('payment_provider'), // PayU, ePayco, MercadoPago, PayPal
  paymentId: text('payment_id'), // ID de transacción devuelto por la pasarela
  createdAt: integer('created_at').notNull(), // Timestamp ms
  updatedAt: integer('updated_at').notNull(), // Timestamp ms
});

// Tabla de Configuraciones Globales (Switch Tienda, etc.)
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
