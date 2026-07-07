import { db, users, sessions } from '../db/client';
import { eq } from 'drizzle-orm';

// --- SISTEMA DE SESIONES ---

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 días

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  return sessionId;
}

export async function validateSession(sessionId: string) {
  if (!sessionId) return null;

  const result = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        username: users.username,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) return null;

  const { session, user } = result[0];

  // Verificar expiración
  if (Date.now() > session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  // Si falta menos de 15 días para expirar, prolongar la sesión
  if (session.expiresAt - Date.now() < 1000 * 60 * 60 * 24 * 15) {
    const newExpiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30;
    await db
      .update(sessions)
      .set({ expiresAt: newExpiresAt })
      .where(eq(sessions.id, sessionId));
  }

  return { session, user };
}

export async function destroySession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// --- HASHING DE CONTRASEÑAS (Web Crypto API) ---
// Alternativa ultraligera a bcrypt, sin dependencias nativas complejas.

const PBKDF2_ITERATIONS = 100000;
const SALT_LEN = 16;
const KEY_LEN = 32;

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Generar salt aleatoria
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  
  // Importar contraseña como llave base
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derivar bits usando PBKDF2 y SHA-256
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    KEY_LEN * 8
  );
  
  // Codificar salt y bits derivados en Hexadecimal
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  
  const [saltHex, hashHex] = parts;
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Decodificar salt Hex a bytes
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  
  // Importar contraseña
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derivar bits
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    KEY_LEN * 8
  );
  
  const checkHashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return checkHashHex === hashHex;
}
