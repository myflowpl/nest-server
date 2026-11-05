// Sprawdzian lekcji: wykonuje scenariusz "Sprawdź" z lekcji i wypisuje ✓ / ✗.
// Serwer musi działać (npm run start:dev). Uruchom: npm run check:d2   (d1 ... d6)
import { existsSync } from 'node:fs';
import pg from 'pg';

const lesson = process.argv[2];
const base = `http://localhost:${process.env.PORT ?? 3000}`;
let failed = 0;

function ok(name, condition, details = '') {
  console.log(`${condition ? '✓' : '✗'} ${name}${!condition && details ? `  -> ${details}` : ''}`);
  if (!condition) failed++;
}

async function api(method, path, { token, body } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  }).catch(() => null);
  if (!res) {
    console.error(`\nSerwer nie odpowiada na ${base}. Uruchom go: npm run start:dev (i poczekaj, aż się wystartuje).`);
    process.exit(2);
  }
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* odpowiedź bez JSON */ }
  return { status: res.status, json };
}

const unique = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
const login = async (email, password) => (await api('POST', '/auth/login', { body: { email, password } })).json?.token;
const adminToken = () => login('admin@example.com', 'admin123');

async function register(email, password = 'secret1', displayName = 'Tester') {
  return api('POST', '/auth/register', { body: { email, password, displayName } });
}

async function sql(query, params = []) {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try { return (await client.query(query, params)).rows; } finally { await client.end(); }
}

const checks = {
  async d1() {
    ok('klient Prismy jest wygenerowany (src/generated/prisma/client.ts)', existsSync('src/generated/prisma/client.ts'));
    const tables = (await sql(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)).map((r) => r.table_name);
    ok('w bazie jest tabela "User"', tables.includes('User'), `tabele: ${tables.join(', ')}`);
    const migrations = await sql(`SELECT migration_name FROM _prisma_migrations`);
    ok('wykonana jest migracja init', migrations.some((m) => m.migration_name.endsWith('_init')), migrations.map((m) => m.migration_name).join(', '));
  },

  async d2() {
    const email = unique('ala');
    const r1 = await register(email);
    ok('rejestracja zwraca 201', r1.status === 201, `status ${r1.status}`);
    ok('odpowiedź zawiera email', r1.json?.email === email);
    ok('odpowiedź NIE zawiera passwordHash', r1.json && !('passwordHash' in r1.json));
    const r2 = await register(email);
    ok('ten sam email drugi raz -> 409', r2.status === 409, `status ${r2.status}`);
    const r3 = await api('POST', '/auth/register', { body: { email: 'x' } });
    ok('błędne dane -> 400', r3.status === 400, `status ${r3.status}`);
    const r4 = await api('POST', '/auth/login', { body: { email, password: 'zle-haslo' } });
    ok('błędne hasło -> 401', r4.status === 401, `status ${r4.status}`);
    const r5 = await api('POST', '/auth/login', { body: { email, password: 'secret1' } });
    ok('poprawne logowanie zwraca token', r5.status === 201 && !!r5.json?.token, `status ${r5.status}`);
    const r6 = await api('GET', '/auth/me');
    ok('/auth/me bez tokenu -> 401', r6.status === 401, `status ${r6.status}`);
    const r7 = await api('GET', '/auth/me', { token: r5.json?.token });
    ok('/auth/me z tokenem zwraca użytkownika', r7.status === 200 && r7.json?.email === email, `status ${r7.status}`);
  },

  async d3() {
    const admin = await adminToken();
    ok('administrator (seed) może się zalogować', !!admin, 'uruchom: npm run db:seed');
    const email = unique('bob');
    const reg = await register(email, 'secret1', 'Bob');
    ok('rejestracja zwraca 201 z profilem i rolą user', reg.status === 201 && reg.json?.displayName === 'Bob' && reg.json?.roles?.join() === 'user', JSON.stringify(reg.json));
    const id = reg.json?.id;
    const user = await login(email, 'secret1');
    ok('zwykły użytkownik na endpoincie admina -> 403', (await api('GET', `/admin/users/${id}`, { token: user })).status === 403);
    const detail = await api('GET', `/admin/users/${id}`, { token: admin });
    ok('administrator widzi użytkownika z rolami', detail.status === 200 && detail.json?.roles?.join() === 'user', `status ${detail.status}`);
    const add1 = await api('POST', `/admin/users/${id}/roles/admin`, { token: admin });
    ok('nadanie roli admin', add1.json?.roles?.includes('admin'), JSON.stringify(add1.json));
    const add2 = await api('POST', `/admin/users/${id}/roles/admin`, { token: admin });
    ok('drugie nadanie tej samej roli nic nie psuje', add2.status === 201 && add2.json?.roles?.length === 2, `status ${add2.status}`);
    const rem = await api('DELETE', `/admin/users/${id}/roles/admin`, { token: admin });
    ok('odebranie roli admin', rem.json?.roles?.join() === 'user', JSON.stringify(rem.json));
    ok('nieistniejący użytkownik -> 404', (await api('GET', '/admin/users/99999999', { token: admin })).status === 404);
    ok('nieznana rola -> 400', (await api('POST', `/admin/users/${id}/roles/boss`, { token: admin })).status === 400);
  },

  async d4() {
    const admin = await adminToken();
    ok('administrator (seed) może się zalogować', !!admin, 'uruchom: npm run db:seed');
    const list = await api('GET', '/admin/users', { token: admin });
    ok('lista: 10 rekordów na stronie, pageSize 10', list.json?.items?.length === 10 && list.json?.pageSize === 10, JSON.stringify(list.json)?.slice(0, 120));
    ok('lista: total >= 51 (admin + 50 z seeda)', list.json?.total >= 51, `total ${list.json?.total}`);
    const page = await api('GET', '/admin/users?pageIndex=1&pageSize=5&sortBy=email&sortDir=asc', { token: admin });
    const emails = page.json?.items?.map((u) => u.email) ?? [];
    ok('strona 2 po 5 rekordów, rosnąco po emailu', emails.length === 5 && emails.join() === [...emails].sort().join(), emails.join());
    const admins = await api('GET', '/admin/users?role=admin&pageSize=50', { token: admin });
    ok('filtr role=admin: każdy ma rolę admin', admins.json?.items?.length > 0 && admins.json.items.every((u) => u.roles.includes('admin')), `total ${admins.json?.total}`);
    const anna = await api('GET', '/admin/users?search=anna&pageSize=50', { token: admin });
    ok('szukanie "anna": każdy wynik ma "anna" w emailu lub nazwie', anna.json?.items?.length > 0 && anna.json.items.every((u) => `${u.email} ${u.displayName}`.toLowerCase().includes('anna')), `total ${anna.json?.total}`);
    const bad = await api('GET', '/admin/users?pageSize=500&sortBy=hack', { token: admin });
    ok('błędne parametry -> 400', bad.status === 400, `status ${bad.status}`);
  },

  async d5() {
    const admin = await adminToken();
    ok('administrator (seed) może się zalogować', !!admin, 'uruchom: npm run db:seed');
    const adminId = (await api('GET', '/auth/me', { token: admin })).json?.id;
    const email = unique('carl');
    const reg = await register(email, 'secret1', 'Carl');
    ok('rejestracja zwraca 201, status ACTIVE', reg.status === 201 && reg.json?.status === 'ACTIVE', JSON.stringify(reg.json));
    const id = reg.json?.id;
    const carlToken = await login(email, 'secret1');
    const block = await api('PATCH', `/admin/users/${id}/status`, { token: admin, body: { status: 'BLOCKED' } });
    ok('blokada: status BLOCKED', block.json?.status === 'BLOCKED', `status ${block.status}`);
    ok('zablokowany nie może się zalogować -> 403', (await api('POST', '/auth/login', { body: { email, password: 'secret1' } })).status === 403);
    ok('stary token zablokowanego przestaje działać -> 401', (await api('GET', '/auth/me', { token: carlToken })).status === 401);
    const unblock = await api('PATCH', `/admin/users/${id}/status`, { token: admin, body: { status: 'ACTIVE' } });
    ok('odblokowanie: status ACTIVE', unblock.json?.status === 'ACTIVE');
    ok('po odblokowaniu logowanie działa', !!(await login(email, 'secret1')));
    const bulk = await api('POST', '/admin/users/bulk-block', { token: admin, body: { ids: [id, adminId] } });
    ok('blokada zbiorcza pomija administratora: blocked = 1', bulk.json?.blocked === 1, JSON.stringify(bulk.json));
    const actions = (await sql(`SELECT action FROM "AuditLog" WHERE "entityId" = $1 ORDER BY id`, [id])).map((r) => r.action);
    ok('dziennik: user.register, user.block, user.unblock', actions.join() === 'user.register,user.block,user.unblock', actions.join());
    const bulkLog = await sql(`SELECT 1 FROM "AuditLog" WHERE action = 'user.bulk-block' AND payload->'ids' @> to_jsonb($1::int)`, [id]);
    ok('dziennik: wpis user.bulk-block z listą id', bulkLog.length > 0);
  },

  async d6() {
    const admin = await adminToken();
    ok('administrator (seed) może się zalogować', !!admin, 'uruchom: npm run db:seed');
    // porównanie robimy w SQL (Prisma zapisuje czas w UTC)
    const [row] = await sql(`SELECT "lastLoginAt" > (now() AT TIME ZONE 'UTC') - interval '1 minute' AS recent FROM "User" WHERE email = 'admin@example.com'`);
    ok('logowanie zapisuje lastLoginAt', row?.recent === true);
    const nulls = await sql(`SELECT count(*)::int AS n FROM "User" WHERE "lastLoginAt" IS NULL`);
    ok('migracja uzupełniła lastLoginAt u istniejących użytkowników', nulls[0].n === 0, `bez lastLoginAt: ${nulls[0].n}`);
    const stats = await api('GET', '/admin/stats', { token: admin });
    const s = stats.json;
    ok('statystyki: kształt odpowiedzi', stats.status === 200 && s && typeof s.total === 'number' && s.byStatus && s.byRole && Array.isArray(s.registrationsPerDay), `status ${stats.status}`);
    const sum = Object.values(s?.byStatus ?? {}).reduce((a, b) => a + b, 0);
    ok('statystyki: total = suma byStatus', s?.total === sum, `${s?.total} vs ${sum}`);
    ok('statystyki: byRole ma admin i user', s?.byRole && 'admin' in s.byRole && 'user' in s.byRole);
  },
};

if (!checks[lesson]) {
  console.error(`Użycie: npm run check:d1 ... check:d6 (podano: ${lesson})`);
  process.exit(2);
}
console.log(`Sprawdzam lekcję ${lesson.toUpperCase()} na ${base}\n`);
await checks[lesson]();
console.log(failed ? `\n${failed} sprawdzeń nie przeszło.` : '\nWszystko się zgadza.');
process.exit(failed ? 1 : 0);
