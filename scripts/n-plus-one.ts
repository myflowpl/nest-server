// Porównanie: ile zapytań SQL wykonuje pętla (N+1) a ile jedno zapytanie z relacjami. Uruchom: npm run db:n-plus-one
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  log: [{ emit: 'event', level: 'query' }],
});

let queries = 0;
prisma.$on('query', () => queries++);

// 1) N+1: jedno zapytanie o użytkowników + po jednym zapytaniu o profil KAŻDEGO z nich
queries = 0;
const users = await prisma.user.findMany({ take: 20 });
for (const user of users) {
  await prisma.profile.findUnique({ where: { userId: user.id } });
}
console.log(`pętla (N+1):       zapytań SQL: ${queries}`);

// 2) jedno findMany z relacją (Prisma wykona 2 zapytania SQL: użytkownicy i profile `IN (...)`)
queries = 0;
await prisma.user.findMany({ take: 20, select: { id: true, email: true, profile: { select: { displayName: true } } } });
console.log(`select z relacją:  zapytań SQL: ${queries}`);

await prisma.$disconnect();
