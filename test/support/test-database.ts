import 'dotenv/config';

/** Adres bazy testowej: ta sama baza co w .env, z końcówką `_test` (np. `nest` -> `nest_test`). Testy nigdy nie dotykają bazy deweloperskiej. */
export function testDatabaseUrl(): string {
  const url = new URL(process.env.DATABASE_URL ?? 'postgresql://nest:nest@localhost:5432/nest');
  url.pathname = `${url.pathname}_test`;
  return url.toString();
}
