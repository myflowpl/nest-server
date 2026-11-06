// Tworzy w bazie rolę agent_ro dla agenta AI (tylko odczyt) i nadaje jej uprawnienia z scripts/ai-db-role.sql.
// Uruchom: npm run ai:db-role   (można wielokrotnie)
import { readFileSync } from 'node:fs';
import pg from 'pg';

const password = process.env.AGENT_DB_PASSWORD;
if (!password) {
  console.error('Brak AGENT_DB_PASSWORD w .env (skopiuj linię z .env.example).');
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
} catch {
  console.error('Nie można połączyć się z PostgreSQL. Uruchom bazę komendą `npm run db:up`.');
  process.exit(1);
}

// rola jest wspólna dla całego serwera PostgreSQL; hasło wstawiamy jako bezpiecznie zacytowany literał
const exists = await client.query(`SELECT 1 FROM pg_roles WHERE rolname = 'agent_ro'`);
const literal = client.escapeLiteral(password);
await client.query(
  exists.rowCount === 0
    ? `CREATE ROLE agent_ro LOGIN PASSWORD ${literal} NOSUPERUSER NOCREATEDB NOCREATEROLE`
    : `ALTER ROLE agent_ro LOGIN PASSWORD ${literal}`,
);
await client.query(readFileSync('scripts/ai-db-role.sql', 'utf8'));
await client.end();
console.log('Rola agent_ro gotowa: tylko odczyt, bez kolumny User.passwordHash.');
