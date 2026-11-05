// Dane startowe: role, konto administratora i 50 użytkowników testowych.
// Uruchom: npm run db:seed (można wielokrotnie - używa upsert).
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { RoleNames } from '../src/auth/auth.types.js';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { demoUsers } from './fixtures.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  // role
  for (const name of Object.values(RoleNames)) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  // administrator: admin@example.com / admin123
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      profile: { create: { displayName: 'Administrator' } },
      roles: { create: { role: { connect: { name: RoleNames.ADMIN } } } },
    },
  });

  // 50 użytkowników testowych z prisma/fixtures.ts (user01..user50@example.com, hasło: password123)
  const passwordHash = await bcrypt.hash('password123', 10);
  for (const user of demoUsers()) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        passwordHash,
        createdAt: user.createdAt,
        profile: { create: { displayName: user.displayName } },
        roles: { create: { role: { connect: { name: user.role } } } },
      },
    });
  }

  console.log('Seed gotowy: role, admin@example.com / admin123 oraz user01..user50@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
