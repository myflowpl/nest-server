// Kontrola lotu dla modułu Testy: uruchamia Twoje testy, a potem psuje kod aplikacji (usterka po usterce)
// i sprawdza, czy Twoje testy to wykrywają. Test, który nie potrafi się wywrócić, niczego nie chroni.
// Uruchom: npm run check:t1   (t2, t3)
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import pg from 'pg';

const chapter = process.argv[2];
let failed = 0;

function ok(name, condition, details = '') {
  console.log(`${condition ? '✓' : '✗'} ${name}${!condition && details ? `  -> ${details}` : ''}`);
  if (!condition) failed++;
}

// konfiguracje i testy do uruchomienia w danym rozdziale
const E2E = ['--config', './vitest.config.e2e.ts'];
// vitest uruchamiamy przez node (działa tak samo na Windows, macOS i Linuksie, bez `npx` i bez powłoki)
const run = (args) => spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', ...args], { encoding: 'utf8' });

/** Zlicza testy z raportu JSON Vitesta (uruchomienie bez psucia kodu). */
function countTests(args) {
  const out = '.vitest-check.json';
  const result = run([...args, '--reporter=json', `--outputFile=${out}`]);
  try {
    const report = JSON.parse(readFileSync(out, 'utf8'));
    return { passed: report.numPassedTests, failed: report.numFailedTests, status: result.status };
  } catch {
    return { passed: 0, failed: 1, status: result.status ?? 1 };
  }
}

/** Zamienia fragment kodu aplikacji, uruchamia testy (powinny się wywrócić) i zawsze przywraca plik. */
function sabotage(label, file, find, replace, args) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(find)) {
    ok(label, false, `w ${file} nie ma fragmentu "${find}" (czy zmieniałeś kod aplikacji?)`);
    return;
  }
  const restore = () => writeFileSync(file, original);
  process.once('SIGINT', () => { restore(); process.exit(130); });
  try {
    writeFileSync(file, original.replace(find, replace));
    const result = countTests(args);
    // usterka jest wykryta tylko wtedy, gdy testy się uruchomiły i któryś się wywrócił (a nie np. nie wystartowały)
    ok(label, result.failed > 0 && result.passed + result.failed > 0, 'testy przeszły mimo usterki albo się nie uruchomiły - brakuje testu, który ją wykryje');
  } finally {
    restore();
  }
}

const unit = ['src', 'test/http'];

// po usterce z blokadą zbiorczą administrator w bazie testowej mógł zostać zablokowany: przywracamy go
async function restoreAdmin() {
  const url = new URL(process.env.DATABASE_URL ?? 'postgresql://nest:nest@localhost:5432/nest');
  url.pathname = `${url.pathname}_test`;
  const client = new pg.Client({ connectionString: url.toString() });
  await client.connect();
  await client.query(`UPDATE "User" SET status = 'ACTIVE' WHERE email = 'admin@example.com'`);
  await client.end();
}
const chapters = {
  t1() {
    const result = countTests(['src']);
    ok(`testy jednostkowe przechodzą (${result.passed} testów)`, result.status === 0 && result.passed >= 12, `przeszło ${result.passed}, nie przeszło ${result.failed}; oczekiwano co najmniej 12 (czy dopisałeś wszystkie testy z kroków 2-6?)`);
    sabotage('usterka: toUserView zwraca undefined zamiast null - test ją wykrywa', 'src/users/user.view.ts', 'user.profile?.displayName ?? null', 'user.profile?.displayName', ['src']);
    sabotage('usterka: login przyjmuje błędne hasło - test ją wykrywa', 'src/auth/auth.service.ts', 'if (!user || !valid) {', 'if (!user) {', ['src']);
    sabotage('usterka: rejestracja zapisuje hasło bez hashowania - test ją wykrywa', 'src/auth/auth.service.ts', 'const passwordHash = await bcrypt.hash(data.password, 10);', 'const passwordHash = data.password;', ['src']);
    sabotage('usterka: P2002 zamieniany na 400 zamiast 409 - test ją wykrywa', 'src/prisma/prisma-exception.filter.ts', 'return { status: HttpStatus.CONFLICT, message: `Rekord już istnieje', 'return { status: HttpStatus.BAD_REQUEST, message: `Rekord już istnieje', ['src']);
  },
  t2() {
    const result = countTests(unit);
    ok(`testy jednostkowe i HTTP przechodzą (${result.passed} testów)`, result.status === 0 && result.passed >= 18, `przeszło ${result.passed}, nie przeszło ${result.failed}; oczekiwano co najmniej 18 (czy dopisałeś wszystkie testy z T1 i T2?)`);
    sabotage('usterka: guard nie sprawdza ról - test ją wykrywa', 'src/auth/jwt-auth.guard.ts', 'if (!has) {', 'if (false) {', ['test/http']);
    sabotage('usterka: pageSize bez limitu - test ją wykrywa', 'src/users/users.dto.ts', '@Max(50)', '@Max(5000)', ['test/http']);
    sabotage('usterka: filtr błędów Prismy nie jest zarejestrowany - test HTTP ją wykrywa', 'src/prisma/prisma.module.ts', '{ provide: APP_FILTER, useClass: PrismaExceptionFilter }', '', ['test/http']);
    sabotage('usterka: brak walidacji DTO - test ją wykrywa', 'src/app.setup.ts', 'app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));', '', ['test/http']);
  },
  async t3() {
    await restoreAdmin(); // gdyby poprzednie uruchomienie zostało przerwane w trakcie usterki
    const result = countTests(E2E);
    ok(`testy z bazą przechodzą (${result.passed} testy)`, result.status === 0 && result.passed >= 4, `przeszło ${result.passed}, nie przeszło ${result.failed}; oczekiwano co najmniej 4 (czy baza działa: npm run db:up?)`);
    sabotage('usterka: zablokowany użytkownik zachowuje dostęp po tokenie - test ją wykrywa', 'src/auth/auth.service.ts', 'where: { id: payload.sub, status: UserStatus.ACTIVE },', 'where: { id: payload.sub },', E2E);
    sabotage('usterka: filtr błędów zamienia P2002 na 400 - test z prawdziwym duplikatem ją wykrywa', 'src/prisma/prisma-exception.filter.ts', 'return { status: HttpStatus.CONFLICT, message: `Rekord już istnieje', 'return { status: HttpStatus.BAD_REQUEST, message: `Rekord już istnieje', E2E);
    sabotage('usterka: blokada zbiorcza obejmuje administratorów - test ją wykrywa', 'src/users/users.service.ts', ', roles: { none: { role: { name: RoleNames.ADMIN } } }', '', E2E);
    return restoreAdmin;
  },
};

if (!chapters[chapter]) {
  console.error('Użycie: node scripts/check-tests.mjs t1|t2|t3');
  process.exit(2);
}
const cleanup = await chapters[chapter]();
if (cleanup) await cleanup();
console.log(failed ? `\n${failed} sprawdzeń nie przeszło.` : '\nWszystko się zgadza.');
process.exit(failed ? 1 : 0);
