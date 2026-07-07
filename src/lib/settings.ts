import { db, settings } from '../db/client';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string, defaultValue = ''): Promise<string> {
  try {
    const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    return result[0]?.value ?? defaultValue;
  } catch (err) {
    console.error(`Error al leer la configuración ${key}:`, err);
    return defaultValue;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  try {
    // Si ya existe la llave, la actualizamos. Si no, la insertamos.
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value },
      });
  } catch (err) {
    console.error(`Error al guardar la configuración ${key}:`, err);
  }
}
