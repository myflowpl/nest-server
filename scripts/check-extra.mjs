// Kontrola lotu modułu Extra: łączy się klientem Socket.IO, wysyła żądania HTTP i sprawdza zachowanie serwera.
// Serwer musi działać (npm run start:dev); od E4 także worker (npm run start:worker).
// Uruchom: npm run check:e1   (e1 ... e6)
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { io } from 'socket.io-client';
import { Redis } from 'ioredis';
import pg from 'pg';
import sharp from 'sharp';

const chapter = process.argv[2];
const base = `http://localhost:${process.env.PORT ?? 3000}`;
const storage = process.env.STORAGE_DIR ?? 'storage';
let failed = 0;

function ok(name, condition, details = '') {
  console.log(`${condition ? '✓' : '✗'} ${name}${!condition && details ? `  -> ${details}` : ''}`);
  if (!condition) failed++;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(fn, timeout = 10000, step = 200) {
  const end = Date.now() + timeout;
  for (;;) {
    const value = await fn();
    if (value) return value;
    if (Date.now() > end) return null;
    await sleep(step);
  }
}

async function api(method, path, { token, body, form } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { ...(body ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: form ?? (body ? JSON.stringify(body) : undefined),
  }).catch(() => null);
  if (!res) {
    console.error(`\nSerwer nie odpowiada na ${base}. Uruchom go: npm run start:dev (i poczekaj, aż się wystartuje).`);
    process.exit(2);
  }
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* odpowiedź bez JSON */ }
  return { status: res.status, json, headers: res.headers };
}

async function sql(query, params = []) {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try { return (await client.query(query, params)).rows; } finally { await client.end(); }
}

const login = async (email, password) => (await api('POST', '/auth/login', { body: { email, password } })).json;
const asAdmin = () => login('admin@example.com', 'admin123');
const asUser = (n = 1) => login(`user${String(n).padStart(2, '0')}@example.com`, 'password123');

/** Łączy się z serwerem. Zwraca { socket, events } albo { error } z komunikatem odrzucenia. */
function connect(token) {
  return new Promise((resolve) => {
    const socket = io(base, { auth: token === undefined ? {} : { token }, reconnection: false, forceNew: true, timeout: 5000 });
    const events = [];
    socket.onAny((name, ...args) => events.push({ name, data: args[0] }));
    socket.on('connect', () => resolve({ socket, events }));
    socket.on('connect_error', (err) => { socket.close(); resolve({ error: err.message }); });
  });
}
const names = (events) => events.map((e) => e.name);
const closeAll = (...clients) => clients.forEach((c) => c?.socket?.close());
const ack = (socket, event, payload) => new Promise((resolve) => socket.timeout(2000).emit(event, payload, (err, res) => resolve(err ? { timeout: true } : res)));

async function png(width = 640, height = 480) {
  return sharp({ create: { width, height, channels: 3, background: '#808080', noise: { type: 'gaussian', mean: 128, sigma: 50 } } }).png().toBuffer();
}
async function upload(userId, token, buffer, { name = 'zdjecie.png', type = 'image/png' } = {}) {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type }), name);
  return api('POST', `/admin/users/${userId}/avatar`, { token, form });
}
const avatarRow = async (userId) => (await sql(`SELECT "avatarStatus" AS status, "avatarKey" AS key FROM "Profile" WHERE "userId" = $1`, [userId]))[0];

const checks = {
  async e1() {
    const admin = await asAdmin();
    const c = await connect(admin.token);
    ok('połączenie WebSocket działa', !c.error, c.error ?? 'brak bramki? serwer nie odpowiada na /socket.io (rozdział E1, kroki 1-2)');
    if (c.error) return;
    c.socket.emit('ping');
    const pong = await until(() => c.events.find((e) => e.name === 'pong'), 2000);
    ok('ping -> zdarzenie pong z polem at', pong && typeof pong.data?.at === 'number', JSON.stringify(pong?.data));
    const res = await ack(c.socket, 'echo', { text: 'cześć' });
    ok('echo zwraca potwierdzenie z tym samym tekstem', res?.text === 'cześć', JSON.stringify(res));
    c.events.length = 0;
    await ack(c.socket, 'echo', { text: '' });
    const ex = await until(() => c.events.find((e) => e.name === 'exception'), 2000);
    ok('echo z pustym tekstem -> zdarzenie exception', !!ex, 'brak zdarzenia exception');
    ok('komunikat wyjątku opisuje błąd walidacji (nie „Internal server error”)', ex && !/internal server error/i.test(JSON.stringify(ex.data)), JSON.stringify(ex?.data));
    c.events.length = 0;
    await ack(c.socket, 'echo', { text: 'x'.repeat(201) });
    ok('echo z tekstem dłuższym niż 200 znaków -> exception', !!(await until(() => c.events.find((e) => e.name === 'exception'), 2000)));
    closeAll(c);
  },

  async e2() {
    const none = await connect();
    ok('połączenie bez tokenu jest odrzucone', !!none.error, 'serwer wpuścił klienta bez tokenu');
    closeAll(none);
    const bad = await connect('to-nie-jest-jwt');
    ok('połączenie z błędnym tokenem jest odrzucone', !!bad.error, 'serwer wpuścił klienta z błędnym tokenem');
    closeAll(bad);

    const admin = await asAdmin();
    const user = await asUser(1);
    const a = await connect(admin.token);
    ok('administrator łączy się z poprawnym tokenem', !a.error, a.error);
    if (a.error) return;
    const welcomeA = await until(() => a.events.find((e) => e.name === 'welcome'), 2000);
    ok('administrator dostaje welcome z e-mailem i pokojami user:{id} oraz admins',
      welcomeA?.data?.user?.email === 'admin@example.com' && welcomeA.data.rooms?.includes(`user:${admin.user.id}`) && welcomeA.data.rooms?.includes('admins'),
      JSON.stringify(welcomeA?.data));

    const u = await connect(user.token);
    ok('zwykły użytkownik łączy się z poprawnym tokenem', !u.error, u.error);
    if (u.error) return closeAll(a);
    const welcomeU = await until(() => u.events.find((e) => e.name === 'welcome'), 2000);
    ok('zwykły użytkownik jest w swoim pokoju, ale nie w pokoju admins',
      welcomeU?.data?.rooms?.includes(`user:${user.user.id}`) && !welcomeU.data.rooms.includes('admins'), JSON.stringify(welcomeU?.data?.rooms));

    const presence = await until(() => a.events.filter((e) => e.name === 'presence').find((e) => e.data?.some((p) => p.userId === user.user.id)), 3000);
    ok('administrator dostaje presence z listą osób online (także użytkownik)', !!presence, JSON.stringify(a.events.filter((e) => e.name === 'presence').at(-1)?.data));
    ok('zwykły użytkownik NIE dostaje presence', !names(u.events).includes('presence'));

    const denied = await ack(u.socket, 'kick', { userId: admin.user.id });
    await sleep(300);
    ok('zwykły użytkownik nie może użyć kick', names(u.events).includes('exception') || denied?.timeout, JSON.stringify(denied));
    ok('administrator pozostał połączony po próbie użytkownika', a.socket.connected);

    const kicked = await ack(a.socket, 'kick', { userId: user.user.id });
    const gone = await until(() => !u.socket.connected, 2000);
    ok('administrator może wyrzucić użytkownika (kick)', !!gone && names(u.events).includes('kicked'), JSON.stringify(kicked));

    // zablokowany użytkownik traci dostęp także do WebSocketu (token sprawdzany w bazie)
    const email = `ws-${Date.now()}@example.com`;
    await api('POST', '/auth/register', { body: { email, password: 'secret1', displayName: 'WS' } });
    const fresh = await login(email, 'secret1');
    await api('PATCH', `/admin/users/${fresh.user.id}/status`, { token: admin.token, body: { status: 'BLOCKED' } });
    const blocked = await connect(fresh.token);
    ok('zablokowany użytkownik nie połączy się z ważnym tokenem', !!blocked.error, 'serwer wpuścił zablokowanego użytkownika');
    closeAll(a, u, blocked);
  },

  async e3() {
    const admin = await asAdmin();
    const user = await asUser(1);
    const img = await png();
    ok('upload bez tokenu -> 401', (await upload(user.user.id, undefined, img)).status === 401);
    ok('upload przez zwykłego użytkownika -> 403', (await upload(user.user.id, user.token, img)).status === 403);
    const txt = await upload(user.user.id, admin.token, Buffer.from('to nie jest zdjęcie'), { name: 'a.png', type: 'image/png' });
    ok('plik tekstowy podpisany jako PNG -> 400', txt.status === 400, `status ${txt.status}`);
    ok('upload na nieistniejącego użytkownika -> 404', (await upload(999999, admin.token, img)).status === 404);
    const big = await upload(user.user.id, admin.token, Buffer.concat([img.subarray(0, 8), Buffer.alloc(6 * 1024 * 1024)]));
    ok('plik większy niż 5 MB -> 413', big.status === 413, `status ${big.status}`);

    const u = await connect(user.token);
    const a = await connect(admin.token);
    const other = await asUser(2);
    const o = await connect(other.token);
    const res = await upload(user.user.id, admin.token, img);
    ok('poprawny PNG -> 201 i klucz pliku', res.status === 201 && !!res.json?.key, `status ${res.status} ${JSON.stringify(res.json)}`);
    const key = res.json?.key;
    const row = await avatarRow(user.user.id);
    ok('w bazie jest klucz pliku i status ustawiony (nie NONE)', row?.key === key && row.status !== 'NONE', JSON.stringify(row));
    ok('oryginał leży w katalogu storage/originals', !!key && existsSync(join(storage, 'originals', `${key}.png`)));
    const evU = await until(() => u.events.find((e) => e.name === 'avatar.status'), 3000);
    ok('właściciel zdjęcia dostaje avatar.status', evU?.data?.userId === user.user.id && evU.data.status === 'PENDING', JSON.stringify(evU?.data));
    ok('administrator też dostaje avatar.status', !!(await until(() => a.events.find((e) => e.name === 'avatar.status'), 3000)));
    await sleep(300);
    ok('inny użytkownik NIE dostaje cudzego avatar.status', !names(o.events).includes('avatar.status'));
    closeAll(u, a, o);
  },

  async e4() {
    const admin = await asAdmin();
    const user = await asUser(3);
    const res = await upload(user.user.id, admin.token, await png(800, 600));
    ok('upload przyjęty (201)', res.status === 201, `status ${res.status}`);
    const key = res.json?.key;
    const row = await until(async () => { const r = await avatarRow(user.user.id); return r?.key === key && r.status === 'READY' ? r : null; }, 15000);
    ok('worker przetworzył zdjęcie, a API zapisało status READY', !!row, `status w bazie: ${(await avatarRow(user.user.id))?.status}. Czy działa worker (npm run start:worker) i Redis (npm run db:up)?`);
    for (const size of [64, 256]) {
      const file = join(storage, 'thumbs', `${key}-${size}.webp`);
      const meta = existsSync(file) ? await sharp(file).metadata() : null;
      ok(`miniaturka ${size} px istnieje (webp, ${size}x${size})`, meta?.format === 'webp' && meta.width === size && meta.height === size, meta ? `${meta.format} ${meta.width}x${meta.height}` : 'brak pliku');
    }
  },

  async e5() {
    const admin = await asAdmin();
    const user = await asUser(4);
    const other = await asUser(5);
    const u = await connect(user.token);
    const a = await connect(admin.token);
    const o = await connect(other.token);
    const res = await upload(user.user.id, admin.token, await png(800, 600));
    ok('upload przyjęty (201)', res.status === 201, `status ${res.status}`);
    const ready = await until(() => u.events.find((e) => e.name === 'avatar.ready'), 15000);
    ok('właściciel dostaje avatar.ready z adresami miniaturek', !!ready?.data?.urls?.['64'] && !!ready.data.urls['256'], JSON.stringify(ready?.data));
    const statuses = u.events.filter((e) => e.name === 'avatar.status').map((e) => e.data.status);
    ok('kolejność statusów: PENDING, PROCESSING, READY', statuses.join() === 'PENDING,PROCESSING,READY', statuses.join());
    ok('administrator widzi to samo (avatar.ready)', !!(await until(() => a.events.find((e) => e.name === 'avatar.ready'), 3000)));
    ok('inny użytkownik nic nie dostaje', !names(o.events).some((n) => n.startsWith('avatar.')));
    if (ready?.data?.urls) {
      const img = await fetch(`${base}${ready.data.urls['64']}`);
      ok('GET miniaturki 64 -> 200, image/webp, cache-control', img.status === 200 && img.headers.get('content-type') === 'image/webp' && /max-age/.test(img.headers.get('cache-control') ?? ''), `${img.status} ${img.headers.get('content-type')} ${img.headers.get('cache-control')}`);
      ok('GET miniaturki o nieznanym rozmiarze -> 404', (await fetch(`${base}${ready.data.urls['64'].replace(/64$/, '999')}`)).status === 404);
    }
    const snap = await api('GET', `/admin/users/${user.user.id}/avatar`, { token: admin.token });
    ok('GET /admin/users/:id/avatar zwraca status READY i adresy', snap.status === 200 && snap.json?.status === 'READY' && !!snap.json.urls?.['256'], `${snap.status} ${JSON.stringify(snap.json)}`);
    closeAll(u, a, o);
  },

  async e6() {
    const admin = await asAdmin();
    const user = await asUser(6);
    const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: 1, lazyConnect: true });
    const u = await connect(user.token);
    const res = await upload(user.user.id, admin.token, await png(1100, 800));
    ok('upload przyjęty (201)', res.status === 201, `status ${res.status}`);
    const ready = await until(() => u.events.find((e) => e.name === 'avatar.ready'), 20000);
    ok('zadanie przeszło przez kolejkę i skończyło się avatar.ready', !!ready, 'czy worker działa (npm run start:worker)?');
    await until(() => u.events.some((e) => e.name === 'avatar.progress' && e.data.progress === 100), 3000);
    const progress = u.events.filter((e) => e.name === 'avatar.progress').map((e) => e.data.progress);
    ok('użytkownik dostał postęp (avatar.progress rosnące, kończy się na 100)', progress.length >= 2 && progress.join() === [...progress].sort((x, y) => x - y).join() && progress.at(-1) === 100, progress.join());
    await redis.connect().catch(() => null);
    const keys = await redis.keys('bull:thumbnails:*').catch(() => []);
    ok('w Redisie jest kolejka BullMQ „thumbnails”', keys.length > 0, 'brak kluczy bull:thumbnails:*');
    await redis.quit().catch(() => null);

    // PNG z poprawnym nagłówkiem, ale uciętymi danymi: przejdzie walidację uploadu, a wywróci worker
    const good = await png(800, 600);
    const broken = good.subarray(0, Math.floor(good.length * 0.6));
    const bad = await upload(user.user.id, admin.token, broken);
    ok('uszkodzony PNG z poprawnym nagłówkiem przechodzi upload (201)', bad.status === 201, `status ${bad.status} ${JSON.stringify(bad.json)}`);
    const failedEvent = await until(() => u.events.find((e) => e.name === 'avatar.failed'), 30000);
    ok('po wyczerpaniu prób użytkownik dostaje avatar.failed', !!failedEvent, 'brak avatar.failed w 30 s');
    const row = await avatarRow(user.user.id);
    ok('w bazie status FAILED', row?.status === 'FAILED', JSON.stringify(row));
    closeAll(u);
  },
};

if (!checks[chapter]) {
  console.error(`Użycie: npm run check:e1 ... check:e6 (podano: ${chapter})`);
  process.exit(2);
}
console.log(`Sprawdzam rozdział ${chapter.toUpperCase()} na ${base}\n`);
await checks[chapter]();
console.log(failed ? `\n${failed} sprawdzeń nie przeszło.` : '\nWszystko się zgadza.');
process.exit(failed ? 1 : 0);
