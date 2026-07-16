import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path check and initialization
const databaseUrl = process.env.DATABASE_URL || 'file:local.db';

if (databaseUrl.startsWith('file:')) {
  const dbPath = databaseUrl.replace(/^file:/, '');
  // Resolve relative to the root directory
  const absoluteDbPath = path.resolve(dbPath);
  const dbDir = path.dirname(absoluteDbPath);

  // Ensure target directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // If target database doesn't exist, copy the pre-seeded local.db
  const seedDbPath = path.resolve('local.db');
  if (!fs.existsSync(absoluteDbPath) && fs.existsSync(seedDbPath)) {
    console.log(`[DB INIT] Persistent database not found at ${absoluteDbPath}. Seeding from ${seedDbPath}...`);
    fs.copyFileSync(seedDbPath, absoluteDbPath);
    console.log('[DB INIT] Seeding completed successfully!');
  } else {
    console.log(`[DB INIT] Using database at ${absoluteDbPath}`);
  }
}

// Start Astro standalone Node server
console.log('[SERVER] Starting Astro standalone server...');
await import(path.join(__dirname, '../dist/server/entry.mjs'));
