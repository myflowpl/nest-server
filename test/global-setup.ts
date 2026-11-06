import { execSync } from 'node:child_process';
import pg from 'pg';
import { testDatabaseUrl } from './support/test-database.js';

/** Raz przed wszystkimi testami e2e: tworzy bazę testową (jeśli jej nie ma), wykonuje migracje i seed. */
export default async function setup() {
  const url = new URL(testDatabaseUrl());
  const dbName = url.pathname.slice(1);

  // połączenie z bazą administracyjną `postgres`, żeby utworzyć bazę testową
  const admin = new pg.Client({ connectionString: new URL('/postgres', url).toString() });
  try {
    await admin.connect();
  } catch {
    throw new Error('Nie można połączyć się z PostgreSQL. Uruchom bazę komendą `npm run db:up` i spróbuj ponownie.');
  }
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE "${dbName}"`);
  }
  await admin.end();

  // migracje i dane startowe (seed jest idempotentny, więc można go uruchamiać za każdym razem)
  const env = { ...process.env, DATABASE_URL: url.toString(), PRISMA_HIDE_UPDATE_MESSAGE: '1' };
  execSync('npx prisma migrate deploy', { env, stdio: 'inherit' });
  execSync('npx prisma db seed', { env, stdio: 'inherit' });

  // seed nie zmienia istniejących kont, więc administrator zablokowany przez wcześniejszy test wrócił by do bazy zablokowany: przywracamy go
  const db = new pg.Client({ connectionString: url.toString() });
  await db.connect();
  await db.query(`UPDATE "User" SET status = 'ACTIVE' WHERE email = 'admin@example.com'`);
  await db.end();
}
