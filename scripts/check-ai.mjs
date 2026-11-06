// Kontrola lotu dla modułu "Praca z AI". Sprawdza WYNIK pracy w repozytorium (pliki, zachowanie aplikacji, uprawnienia bazy),
// a nie to, co powiedział agent ani jakim narzędziem go uzyskałeś. Uruchom: npm run check:a1   (a2 ... a5)
// a2, a4 i a5 wymagają działającego serwera (npm run start:dev) i bazy (npm run db:up).
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import pg from 'pg';

const chapter = process.argv[2];
const base = `http://localhost:${process.env.PORT ?? 3000}`;
let failed = 0;

function ok(name, condition, details = '') {
  console.log(`${condition ? '✓' : '✗'} ${name}${!condition && details ? `  -> ${details}` : ''}`);
  if (!condition) failed++;
}

const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
const packageScripts = () => JSON.parse(readFileSync('package.json', 'utf8')).scripts;
const git = (...args) => spawnSync('git', args, { encoding: 'utf8' }).stdout ?? '';
// vitest uruchamiamy przez node (działa tak samo na Windows, macOS i Linuksie, bez `npx` i bez powłoki)
const vitest = (args) => spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', ...args], { encoding: 'utf8' });

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
  return { status: res.status, text, json, headers: res.headers };
}

/** Sprawdza na początku, czy serwer odpowiada (kontrole a2, a4 i a5 go potrzebują). */
const requireServer = () => api('GET', '/');
const login = async (email, password) => (await api('POST', '/auth/login', { body: { email, password } })).json?.token;
const adminToken = () => login('admin@example.com', 'admin123');
const userToken = () => login('user01@example.com', 'password123');
const unique = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;

async function sql(query, params = [], connectionString = process.env.DATABASE_URL) {
  const client = new pg.Client({ connectionString });
  await client.connect();
  try { return await client.query(query, params); } finally { await client.end(); }
}

/** Zamienia fragment pliku, wykonuje akcję i zawsze przywraca plik (też po Ctrl+C). */
async function withFile(file, change, action) {
  const original = readFileSync(file, 'utf8');
  const changed = change(original);
  if (changed === null) return { skipped: true };
  const restore = () => writeFileSync(file, original);
  process.once('SIGINT', () => { restore(); process.exit(130); });
  try {
    writeFileSync(file, changed);
    return { skipped: false, result: await action() };
  } finally {
    restore();
  }
}

/** Zlicza testy z raportu JSON Vitesta. */
function countTests(args) {
  const out = '.vitest-check.json';
  const result = vitest([...args, '--reporter=json', `--outputFile=${out}`]);
  try {
    const report = JSON.parse(readFileSync(out, 'utf8'));
    return { passed: report.numPassedTests, failed: report.numFailedTests, status: result.status };
  } catch {
    return { passed: 0, failed: 1, status: result.status ?? 1 };
  }
}

/** Usterka w kodzie aplikacji: testy podane w args powinny się wywrócić. */
async function sabotage(label, file, find, replace, args) {
  const { skipped, result } = await withFile(
    file,
    (original) => (original.includes(find) ? original.replace(find, replace) : null),
    () => countTests(args),
  );
  if (skipped) return ok(label, false, `w ${file} nie ma fragmentu "${find}" (czy zmieniałeś ten plik?)`);
  ok(label, result.failed > 0 && result.passed + result.failed > 0, 'testy przeszły mimo usterki (albo się nie uruchomiły) - brakuje testu, który ją wykryje');
}

/** Polecenia `npm run xxx` wspomniane w tekście, które nie istnieją w package.json. */
function unknownNpmScripts(text) {
  const scripts = packageScripts();
  const mentioned = [...text.matchAll(/npm run ([\w:.-]+)/g)].map((m) => m[1]);
  return [...new Set(mentioned)].filter((name) => !(name in scripts));
}

const chapters = {
  // A1: plik z regułami projektu
  async a1() {
    const agents = read('AGENTS.md');
    ok('jest plik AGENTS.md', agents.length > 0, 'utwórz AGENTS.md w katalogu głównym projektu (krok 2)');
    const lines = agents.trimEnd().split('\n').length;
    ok(`AGENTS.md jest zwięzły (${agents ? lines : 0} linii, maks. 120)`, agents.length > 0 && lines <= 120, agents ? 'krótki plik agent faktycznie czyta; usuń to, co wynika z kodu' : 'brak pliku');
    const unknown = unknownNpmScripts(agents);
    ok('komendy `npm run ...` z AGENTS.md istnieją w package.json', agents.length > 0 && unknown.length === 0, agents ? `nie ma takich skryptów: ${unknown.join(', ')}` : 'brak pliku');
    const topics = [
      ['testy (Vitest)', /vitest/i],
      ['import z rozszerzeniem .js', /\.js\b/],
      ['migracje Prismy', /migrate|db:migrate/i],
      ['granice: czego nie ruszać', /nie (edytuj|ruszaj|modyfikuj|zmieniaj|wolno|commituj)|never|zakaz/i],
    ];
    for (const [name, pattern] of topics) ok(`AGENTS.md opisuje: ${name}`, pattern.test(agents), 'dopisz tę regułę');
    const secrets = /\w+:\/\/[^\s:@\/]+:[^\s@]+@|(JWT_SECRET|POSTGRES_PASSWORD|AGENT_DB_PASSWORD|password|haslo|hasło|secret|token|apikey)\s*[=:]\s*\S+|admin123|password123/i.test(agents);
    ok('w AGENTS.md nie ma haseł ani adresów z hasłem', agents.length > 0 && !secrets, 'reguły trafiają do repozytorium - żadnych sekretów');
    const claude = read('CLAUDE.md');
    ok('CLAUDE.md importuje AGENTS.md (@AGENTS.md)', /^@AGENTS\.md\s*$/m.test(claude), 'CLAUDE.md ma zawierać linię @AGENTS.md (krok 3)');
  },

  // A2: eksport użytkowników z kontraktu zadania
  async a2() {
    await requireServer();
    const admin = await adminToken();
    const user = await userToken();
    const res = await api('GET', '/admin/users/export', { token: admin });
    const hint = res.status === 400 && /numeric string/.test(res.text) ? ' (czy @Get(\'export\') jest przed @Get(\':id\')?)' : '';
    const works = res.status === 200 && /text\/csv/.test(res.headers.get('content-type') ?? '');
    ok('administrator: 200 i Content-Type text/csv', works, `status ${res.status}, ${res.headers.get('content-type')}${hint}`);
    // kody 401/403 zaliczamy dopiero, gdy trasa w ogóle istnieje (inaczej 401/403 dałby też sam guard na nieistniejącej trasie)
    const anon = await api('GET', '/admin/users/export');
    ok('bez tokenu: 401', works && anon.status === 401, works ? `status ${anon.status}` : 'najpierw endpoint musi działać (200)');
    const forbidden = await api('GET', '/admin/users/export', { token: user });
    ok('zwykły użytkownik: 403', works && forbidden.status === 403, works ? `status ${forbidden.status}` : 'najpierw endpoint musi działać (200)');
    const body = res.text.replace(/^\uFEFF/, ''); // BOM UTF-8 nie przeszkadza
    const rows = body.trim().split(/\r?\n/);
    ok('nagłówek CSV: id,email,displayName,status,createdAt', rows[0] === 'id,email,displayName,status,createdAt', `jest: ${rows[0]?.slice(0, 80)}`);
    const total = (await sql(`SELECT count(*)::int AS n FROM "User"`)).rows[0].n;
    ok(`jeden wiersz na użytkownika (${total})`, rows.length - 1 === total, `wierszy danych: ${rows.length - 1}`);
    ok('w CSV nie ma hasła (passwordHash, $2b$)', works && !/passwordHash|\$2[aby]\$/.test(res.text), works ? '' : 'najpierw endpoint musi działać (200)');

    // filtr po statusie: blokujemy jednego użytkownika, sprawdzamy, odblokowujemy
    const target = (await sql(`SELECT id, email FROM "User" WHERE email = 'user02@example.com'`)).rows[0];
    await api('PATCH', `/admin/users/${target.id}/status`, { token: admin, body: { status: 'BLOCKED' } });
    const blocked = await api('GET', '/admin/users/export?status=BLOCKED', { token: admin });
    await api('PATCH', `/admin/users/${target.id}/status`, { token: admin, body: { status: 'ACTIVE' } });
    const blockedRows = blocked.text.trim().split(/\r?\n/).slice(1);
    ok('?status=BLOCKED zwraca tylko zablokowanych', blocked.status === 200 && blockedRows.some((r) => r.includes(target.email)) && blockedRows.every((r) => r.includes(',BLOCKED,')), `status ${blocked.status}, wierszy ${blockedRows.length}`);
    const bad = await api('GET', '/admin/users/export?status=NIEZNANY', { token: admin });
    ok('zły status: 400', works && bad.status === 400, works ? `status ${bad.status}` : 'najpierw endpoint musi działać (200)');

    // CSV injection: nazwa zaczynająca się od "=" nie może być formułą w Excelu
    const email = unique('csv');
    await api('POST', '/auth/register', { body: { email, password: 'secret1', displayName: '=HYPERLINK("http://zlosliwa.example")' } });
    const csv = await api('GET', '/admin/users/export', { token: admin });
    const line = csv.text.split(/\r?\n/).find((l) => l.includes(email)) ?? '';
    ok('nazwa zaczynająca się od "=" jest zabezpieczona przed formułą w Excelu', line !== '' && !/(^|,)"?=/.test(line), `wiersz: ${line.slice(0, 100)}`);
    await sql(`DELETE FROM "User" WHERE email = $1`, [email]);

    // dyscyplina zakresu: zmiany tylko tam, gdzie pozwala kontrakt
    const changed = [...new Set([...git('diff', '--name-only', 'HEAD').split('\n'), ...git('ls-files', '--others', '--exclude-standard').split('\n')])].filter(Boolean);
    const allowed = [/^src\/users\//, /^test\//, /^tasks\//, /^\.claude\/skills\//, /^AGENTS\.md$/, /^CLAUDE\.md$/];
    ok('są niezacommitowane zmiany do sprawdzenia', changed.length > 0, 'uruchom Kontrolę lotu przed commitem (jeśli już zrobiłeś commit: git reset --soft HEAD~1)');
    const outside = changed.filter((file) => !allowed.some((pattern) => pattern.test(file)));
    ok('zmiany tylko w src/users, test, tasks i .claude/skills', outside.length === 0, `poza zakresem: ${outside.join(', ')}`);
    ok('package.json bez nowych zależności', !changed.includes('package.json') && !changed.includes('package-lock.json'), 'kontrakt zabrania nowych bibliotek');
    ok('lint przechodzi', spawnSync(process.execPath, ['node_modules/oxlint/bin/oxlint', '--type-aware', 'src/', 'test/'], { encoding: 'utf8' }).status === 0, 'uruchom npm run lint i popraw');
    const unit = countTests(['src', 'test/http']);
    ok(`testy przechodzą (${unit.passed})`, unit.status === 0 && unit.passed > 0, `nie przeszło ${unit.failed}`);
    ok('dopisany jest nowy test jednostkowy (plik *.spec.ts)', changed.some((f) => /\.spec\.ts$/.test(f)), 'kontrakt wymaga testu zamiany użytkowników na CSV');

    // artefakty kroków 1 i 4
    ok('jest kontrakt zadania tasks/eksport-uzytkownikow.md', existsSync('tasks/eksport-uzytkownikow.md'), 'krok 1');
    ok('jest skill .claude/skills/ai-review/SKILL.md', /\bdescription:/.test(read('.claude/skills/ai-review/SKILL.md')), 'krok 4: SKILL.md z polem description');
  },

  // A3: bezpieczny dostęp agenta do bazy
  async a3() {
    const mcp = (() => { try { return JSON.parse(read('.mcp.json')); } catch { return null; } })();
    ok('jest poprawny plik .mcp.json', mcp?.mcpServers && Object.keys(mcp.mcpServers).length > 0, 'krok 3: utwórz .mcp.json z sekcją mcpServers');
    const server = Object.values(mcp?.mcpServers ?? {})[0];
    const command = [server?.command, ...(server?.args ?? [])].join(' ');
    ok('serwer MCP to DBHub z plikiem dbhub.toml', /dbhub/.test(command) && /--config/.test(command) && /dbhub\.toml/.test(command), `komenda: ${command}`);
    ok('w .mcp.json nie ma hasła do bazy', !/postgres(ql)?:\/\/|password|agent_ro/i.test(read('.mcp.json')), 'hasło jest tylko w dbhub.toml (poza gitem)');

    const toml = read('dbhub.toml');
    ok('jest dbhub.toml (npm run ai:mcp-config)', toml.length > 0, 'krok 2');
    ok('w dbhub.toml: połączenie jako agent_ro i readonly = true', /agent_ro/.test(toml) && /readonly\s*=\s*true/.test(toml), 'wygeneruj plik ponownie');
    ok('dbhub.toml jest poza gitem (.gitignore)', spawnSync('git', ['check-ignore', '-q', 'dbhub.toml']).status === 0, 'dopisz dbhub.toml do .gitignore');

    // uprawnienia roli sprawdzamy bezpośrednio w bazie, jako agent_ro
    const url = new URL(process.env.DATABASE_URL);
    url.username = 'agent_ro';
    url.password = process.env.AGENT_DB_PASSWORD ?? '';
    const asAgent = async (query) => {
      try { return { ok: true, rows: (await sql(query, [], url.toString())).rows }; } catch (error) { return { ok: false, error: error.message }; }
    };
    const select = await asAgent(`SELECT id, email, status FROM "User" LIMIT 1`);
    ok('agent_ro czyta użytkowników (id, email, status)', select.ok, select.error ?? 'uruchom npm run ai:db-role');
    ok('agent_ro nie widzi passwordHash', !(await asAgent(`SELECT "passwordHash" FROM "User" LIMIT 1`)).ok, 'rola ma dostęp do hasła (npm run ai:db-role)');
    ok('agent_ro nie wykona SELECT * z tabeli User (bo to też hasło)', !(await asAgent(`SELECT * FROM "User" LIMIT 1`)).ok, 'uruchom npm run ai:db-role');
    ok('agent_ro nie zmieni danych nawet po BEGIN READ WRITE (UPDATE)', !(await asAgent(`BEGIN READ WRITE; UPDATE "User" SET status = 'BLOCKED'; ROLLBACK`)).ok, 'rola może zapisywać');
    ok('agent_ro nie usunie danych nawet po BEGIN READ WRITE (DELETE)', !(await asAgent(`BEGIN READ WRITE; DELETE FROM "AuditLog"; ROLLBACK`)).ok, 'rola może zapisywać');
    ok('agent_ro nie utworzy tabeli nawet po BEGIN READ WRITE (DDL)', !(await asAgent(`BEGIN READ WRITE; CREATE TABLE agent_smieci (id int); ROLLBACK`)).ok, 'rola może zmieniać schemat');
    // uprawnienia czytamy wprost z katalogu bazy (jako właściciel), żeby nie zależeć od jednej próby
    const writes = (await sql(`SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r' AND has_table_privilege('agent_ro', c.oid, 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')`)).rows.map((r) => r.relname);
    ok('agent_ro nie ma uprawnień do zapisu w żadnej tabeli', writes.length === 0, `zapis możliwy w: ${writes.join(', ')}`);
    const create = (await sql(`SELECT has_schema_privilege('agent_ro', 'public', 'CREATE') AS can`)).rows[0].can;
    ok('agent_ro nie ma prawa tworzenia obiektów w schemacie public', !create, 'rola może zmieniać schemat');

    ok('.env nie jest w repozytorium', git('ls-files', '.env').trim() === '', 'plik .env nie może być w gicie');
  },

  // A4: testy, dane i dokumentacja wygenerowane przez AI
  async a4() {
    await requireServer();
    // 1) testy StatsService: pokrycie i usterki
    const hasSpec = existsSync('src/stats/stats.service.spec.ts');
    ok('jest src/stats/stats.service.spec.ts', hasSpec, 'krok 1: najpierw napisz testy StatsService');
    if (hasSpec) {
    const cov = vitest(['src/stats', '--coverage', '--coverage.reporter=json-summary', '--coverage.include=src/stats/stats.service.ts', '--coverage.reportsDirectory=.coverage-check']);
    let pct = 0;
    try { pct = JSON.parse(readFileSync('.coverage-check/coverage-summary.json', 'utf8')).total.lines.pct; } catch { /* brak raportu */ }
    ok(`testy przechodzą, a pokrycie stats.service.ts to ${pct}% (min. 90%)`, cov.status === 0 && pct >= 90, cov.status === 0 ? 'dopisz scenariusze' : 'testy się wywracają');
    const file = 'src/stats/stats.service.ts';
    await sabotage('usterka: total liczy statusy zamiast użytkowników - test ją wykrywa', file, 'sum + row._count._all', 'sum + 1', ['src/stats']);
    await sabotage('usterka: okno "ostatnie 7 dni" to 70 dni - test ją wykrywa', file, 'Date.now() - 7 * DAY', 'Date.now() - 70 * DAY', ['src/stats']);
    await sabotage('usterka: byRole zawsze zwraca 0 - test ją wykrywa', file, '[role.name, role._count.users]', '[role.name, 0]', ['src/stats']);
    await sabotage('usterka: rejestracje z 1 dnia zamiast 14 - test ją wykrywa', file, 'this.registrationsPerDay(14)', 'this.registrationsPerDay(1)', ['src/stats']);
    }

    // 2) dane demo: uruchomienie dwa razy, deterministyczne, bezpieczne
    ok('jest skrypt npm run db:seed:demo', 'db:seed:demo' in packageScripts(), 'krok 2: dodaj skrypt db:seed:demo do package.json');
    if ('db:seed:demo' in packageScripts()) {
      const demo = `SELECT email FROM "User" WHERE email LIKE '%@demo.example' ORDER BY email`;
      const other = `SELECT count(*)::int AS n FROM "User" WHERE email NOT LIKE '%@demo.example'`;
      const before = (await sql(other)).rows[0].n;
      const run1 = spawnSync('npm', ['run', '-s', 'db:seed:demo'], { encoding: 'utf8', shell: process.platform === 'win32' });
      const first = (await sql(demo)).rows.map((r) => r.email);
      const run2 = spawnSync('npm', ['run', '-s', 'db:seed:demo'], { encoding: 'utf8', shell: process.platform === 'win32' });
      const second = (await sql(demo)).rows.map((r) => r.email);
      ok('seed demo działa (dwa uruchomienia bez błędu)', run1.status === 0 && run2.status === 0, (run1.stderr || run2.stderr || '').split('\n')[0]);
      ok(`seed demo tworzy 150 użytkowników @demo.example (jest ${first.length})`, first.length === 150, 'kontrakt: dokładnie 150');
      ok('drugie uruchomienie nie dubluje danych i daje te same adresy', second.length === first.length && second.join() === first.join());
      ok('seed demo nie zmienia pozostałych użytkowników', (await sql(other)).rows[0].n === before);
      const hashes = (await sql(`SELECT "passwordHash" AS h FROM "User" WHERE email LIKE '%@demo.example'`)).rows;
      ok('hasła demo są zahaszowane (bcrypt)', hashes.length > 0 && hashes.every((r) => /^\$2[aby]\$/.test(r.h)));
      const statuses = new Set((await sql(`SELECT DISTINCT status FROM "User" WHERE email LIKE '%@demo.example'`)).rows.map((r) => r.status));
      ok('demo ma użytkowników ACTIVE i BLOCKED', statuses.has('ACTIVE') && statuses.has('BLOCKED'));
      const counts = (await sql(`SELECT count(*) FILTER (WHERE status = 'BLOCKED')::int AS blocked, (SELECT count(*)::int FROM "UserRole" ur JOIN "Role" r ON r.id = ur."roleId" JOIN "User" u ON u.id = ur."userId" WHERE r.name = 'admin' AND u.email LIKE '%@demo.example') AS admins FROM "User" WHERE email LIKE '%@demo.example'`)).rows[0];
      ok(`numer podzielny przez 10 jest BLOCKED (${counts.blocked} z 15), podzielny przez 15 jest adminem (${counts.admins} z 10)`, counts.blocked === 15 && counts.admins === 10, 'zgodnie z kontraktem: co 10. BLOCKED, co 15. admin');
      const sample = (await sql(`SELECT "passwordHash" AS h FROM "User" WHERE email = 'demo001@demo.example'`)).rows[0]?.h ?? '';
      const bcrypt = (await import('bcrypt')).default ?? (await import('bcrypt'));
      ok('hasło demo to demo1234', sample !== '' && (await bcrypt.compare('demo1234', sample)), 'hash demo001 nie pasuje do hasła demo1234');
      const scriptFile = /(prisma\/[\w.-]+\.ts)/.exec(packageScripts()['db:seed:demo'])?.[1];
      ok('skrypt seed nie używa Math.random()', !!scriptFile && !/Math\.random/.test(read(scriptFile)), 'losowość tylko z generatora z ziarnem');
    }

    // 3) dokumentacja: każdy endpoint z docs/API.md istnieje i każdy endpoint /admin jest opisany
    const docs = read('docs/API.md');
    ok('jest docs/API.md', docs.length > 0, 'krok 3');
    if (docs) {
      const spec = (await api('GET', '/docs-json')).json;
      const real = new Set(Object.entries(spec?.paths ?? {}).flatMap(([path, methods]) => Object.keys(methods).map((m) => `${m.toUpperCase()} ${path.replace(/\{(\w+)\}/g, ':$1')}`)));
      const documented = [...docs.matchAll(/\b(GET|POST|PATCH|PUT|DELETE)\s+(\/[\w\-/:{}]*)/g)].map((m) => `${m[1]} ${m[2].replace(/\{(\w+)\}/g, ':$1')}`);
      const invented = [...new Set(documented)].filter((entry) => !real.has(entry));
      ok('dokumentacja nie zawiera wymyślonych endpointów', real.size > 0 && invented.length === 0, `nie ma takich tras: ${invented.join(', ')}`);
      // /admin/audit powstaje dopiero w A5, więc tu go nie wymagamy
      const missing = [...real].filter((entry) => entry.split(' ')[1].startsWith('/admin') && !entry.includes('/admin/audit') && !documented.includes(entry));
      ok('dokumentacja opisuje wszystkie endpointy /admin', real.size > 0 && missing.length === 0, `brakuje: ${missing.join(', ')}`);
      ok('dokumentacja opisuje kody błędów 401 i 403 oraz parametr pageSize', /\b401\b/.test(docs) && /\b403\b/.test(docs) && /pageSize/.test(docs), 'dopisz kody błędów i parametry zapytań (nie sama lista tras)');
      ok('dokumentacja nie wspomina o passwordHash w odpowiedziach', !/passwordHash/.test(docs), 'passwordHash nigdy nie wychodzi z API');
    }
  },

  // A5: przegląd PR-a od agenta i granice
  async a5() {
    ok('PR od agenta jest dodany (src/audit)', existsSync('src/audit/audit.service.ts'), 'uruchom npm run ai:pr-agenta (krok 1)');
    await requireServer();
    const admin = await adminToken();
    const user = await userToken();

    // dane do sprawdzenia: wpisy w dzienniku
    const target = (await sql(`SELECT id FROM "User" WHERE email = 'user03@example.com'`)).rows[0];
    await api('PATCH', `/admin/users/${target.id}/status`, { token: admin, body: { status: 'BLOCKED' } });
    await api('PATCH', `/admin/users/${target.id}/status`, { token: admin, body: { status: 'ACTIVE' } });

    const list = await api('GET', '/admin/audit?action=user.block', { token: admin });
    ok('działa: administrator dostaje wpisy user.block', list.status === 200 && Array.isArray(list.json) && list.json.length > 0 && list.json.every((e) => e.action === 'user.block'), `status ${list.status}`);

    const injected = await api('GET', `/admin/audit?action=${encodeURIComponent("x' OR '1'='1")}`, { token: admin });
    ok('luka 1 - wstrzyknięcie SQL w ?action nie zwraca wpisów', injected.status < 500 && !(Array.isArray(injected.json) && injected.json.length > 0), `status ${injected.status}, wpisów ${injected.json?.length}`);
    const asUser = await api('GET', '/admin/audit', { token: user });
    ok('luka 2 - zwykły użytkownik dostaje 403', asUser.status === 403, `status ${asUser.status}`);
    // autor wpisu: tylko id i email (żadnych pól konta takich jak status, lastLoginAt, hasło)
    const userFields = new Set(['passwordHash', 'status', 'lastLoginAt', 'updatedAt']);
    const leaks = (value, depth = 0) => (value && typeof value === 'object' && depth < 3 ? Object.entries(value).some(([k, v]) => userFields.has(k) || leaks(v, depth + 1)) : false);
    ok('luka 3 - odpowiedź nie zawiera passwordHash ani innych pól konta autora', list.status === 200 && Array.isArray(list.json) && !/\$2[aby]\$/.test(list.text) && !list.json.some((entry) => leaks(entry)), 'z autora zwracaj tylko id i email');
    const huge = await api('GET', '/admin/audit?limit=100000', { token: admin });
    const junk = await api('GET', '/admin/audit?limit=abc', { token: admin });
    ok('luka 4 - limit jest ograniczony (400 albo maks. 100 wpisów)', (huge.status === 400 || (Array.isArray(huge.json) && huge.json.length <= 100)) && junk.status === 400, `limit=100000 -> ${huge.status}, limit=abc -> ${junk.status}`);
    const token = (await api('POST', '/auth/login', { body: { email: 'admin@example.com', password: 'admin123' } })).json?.token ?? '';
    const payload = JSON.parse(Buffer.from(token.split('.')[1] ?? 'e30', 'base64url').toString());
    ok('luka 5 - token jak wcześniej ważny 1 dzień (niepowiązana zmiana wycofana)', payload.exp - payload.iat <= 24 * 3600, `ważność ${Math.round((payload.exp - payload.iat) / 3600)} h`);

    // luka 6: testy modułu audytu muszą coś sprawdzać
    const specs = existsSync('src/audit') ? readdirSync('src/audit').filter((f) => f.endsWith('.spec.ts')).map((f) => read(`src/audit/${f}`)).join('\n') : '';
    const tests = (specs.match(/\b(it|test)(\.each\([^)]*\))?\(/g) ?? []).length;
    const strong = [...specs.matchAll(/\.(?:not\.)?(?:resolves\.|rejects\.)?(to\w+)\(/g)].filter((m) => !['toBeDefined', 'toBeTruthy', 'toHaveBeenCalled'].includes(m[1])).length;
    ok(`luka 6 - testy audytu: min. 3 testy (jest ${tests}) i min. 3 konkretne asercje (jest ${strong})`, tests >= 3 && strong >= 3, 'test ma sprawdzać wynik i parametry, a nie tylko, że coś zostało wywołane');
    const original = read('scripts/ai-pr/audit.service.ts.txt');
    const { skipped, result } = await withFile('src/audit/audit.service.ts', () => original, () => countTests(['src/audit']));
    ok('luka 6 - Twoje testy wywracają się na oryginalnym kodzie agenta', !skipped && result.failed > 0, 'testy przechodzą na kodzie z lukami - nie wykrywają niczego');

    // uprawnienia agenta
    const settings = (() => { try { return JSON.parse(read('.claude/settings.json')); } catch { return null; } })();
    const deny = (settings?.permissions?.deny ?? []).join('\n');
    ok('.claude/settings.json blokuje czytanie .env', /Read\(\.?\/?\.env/.test(deny), 'krok 4: permissions.deny z Read(./.env)');
    ok('.claude/settings.json blokuje git push', /git push/.test(deny));
    ok('.claude/settings.json blokuje prisma migrate reset', /migrate reset/.test(deny));

    ok('lint przechodzi', spawnSync(process.execPath, ['node_modules/oxlint/bin/oxlint', '--type-aware', 'src/', 'test/'], { encoding: 'utf8' }).status === 0, 'uruchom npm run lint');
    const unit = countTests(['src', 'test/http']);
    ok(`wszystkie testy przechodzą (${unit.passed})`, unit.status === 0 && unit.passed > 0, `nie przeszło ${unit.failed}`);
  },
};

if (!chapters[chapter]) {
  console.error('Użycie: node scripts/check-ai.mjs a1|a2|a3|a4|a5');
  process.exit(2);
}
await chapters[chapter]();
const plural = (n) => (n === 1 ? 'sprawdzenie' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'sprawdzenia' : 'sprawdzeń');
console.log(failed ? `\nNie przeszło: ${failed} ${plural(failed)}.` : '\nWszystko się zgadza.');
process.exit(failed ? 1 : 0);
