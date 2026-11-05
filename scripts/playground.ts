// Pierwsze zapytania do bazy przez Prisma Client. Uruchom: npm run db:playground
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter, log: ['query'] });

// create
const user = await prisma.user.create({
  data: { email: `ala${Date.now()}@example.com`, passwordHash: 'hash' },
});
console.log('create ->', user);

// read
console.log('findUnique ->', await prisma.user.findUnique({ where: { id: user.id } }));
console.log('findMany ->', (await prisma.user.findMany({ orderBy: { id: 'desc' }, take: 3 })).length, 'rekordów');

// update
console.log('update ->', await prisma.user.update({ where: { id: user.id }, data: { email: `zmiana${user.id}@example.com` } }));

// delete
await prisma.user.delete({ where: { id: user.id } });
console.log('delete -> gotowe');

await prisma.$disconnect();
