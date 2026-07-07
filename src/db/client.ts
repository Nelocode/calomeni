import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Intentamos leer la variable de entorno para la base de datos de múltiples formas
// para asegurar compatibilidad con diferentes adaptadores de Astro (Node, Vercel, etc.)
const databaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.DATABASE_URL) || 
  (typeof process !== 'undefined' && process.env?.DATABASE_URL) || 
  'file:local.db';

const databaseAuthToken = 
  (typeof import.meta !== 'undefined' && import.meta.env?.DATABASE_AUTH_TOKEN) || 
  (typeof process !== 'undefined' && process.env?.DATABASE_AUTH_TOKEN) || 
  undefined;

export const client = createClient({
  url: databaseUrl,
  authToken: databaseAuthToken,
});

export const db = drizzle(client, { schema });
export * from './schema';
