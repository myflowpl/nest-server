// Reguła "w systemie zostaje co najmniej jeden administrator" i eksperyment z wyścigiem dwóch administratorów.
// Serwer musi działać (npm run start:dev). Skrypt sam przygotowuje dane, a na końcu przywraca role administratorów.
// Uruchom: npm run db:race
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const base = `http://localhost:${process.env.PORT ?? 3000}`;
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return (await res.json()).token;
}

async function call(method: string, path: string, token: string, body?: object): Promise<string> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return `${res.status} ${res.ok ? 'ok' : (await res.json()).message}`;
}

const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'admin' } });
const originalAdmins = await prisma.userRole.findMany({ where: { roleId: adminRole.id } }); // do przywrócenia na końcu

try {
  const [a, b] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { email: 'admin@example.com' } }),
    prisma.user.findUniqueOrThrow({ where: { email: 'user10@example.com' } }),
  ]);

  // 1) tylko admin@example.com jest administratorem
  await prisma.userRole.deleteMany({ where: { roleId: adminRole.id, userId: { not: a.id } } });
  const tokenA = await login('admin@example.com', 'admin123');

  console.log('--- Reguła: w systemie musi zostać co najmniej jeden aktywny administrator');
  console.log('odebranie roli ostatniemu administratorowi ->', await call('DELETE', `/admin/users/${a.id}/roles/admin`, tokenA));
  console.log('zablokowanie ostatniego administratora     ->', await call('PATCH', `/admin/users/${a.id}/status`, tokenA, { status: 'BLOCKED' }));

  // 2) drugi administrator i wyścig: każdy w tej samej chwili odbiera rolę temu drugiemu
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: b.id, roleId: adminRole.id } },
    update: {},
    create: { userId: b.id, roleId: adminRole.id },
  });
  const tokenB = await login('user10@example.com', 'password123');

  console.log('\n--- Wyścig: dwóch administratorów jednocześnie odbiera sobie nawzajem rolę');
  const [resultA, resultB] = await Promise.all([
    call('DELETE', `/admin/users/${b.id}/roles/admin`, tokenA),
    call('DELETE', `/admin/users/${a.id}/roles/admin`, tokenB),
  ]);
  console.log('A odbiera rolę B ->', resultA);
  console.log('B odbiera rolę A ->', resultB);

  const admins = await prisma.userRole.count({ where: { roleId: adminRole.id } });
  console.log(`\nAdministratorów po wyścigu: ${admins}`, admins === 0 ? '  <-- BŁĄD: system bez administratora!' : '  (reguła zachowana)');
} finally {
  // przywracamy role administratorów sprzed uruchomienia skryptu
  await prisma.userRole.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.userRole.createMany({ data: originalAdmins, skipDuplicates: true });
  await prisma.$disconnect();
}
