import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // npx prisma db seed
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // domyślnie baza z compose.yaml; dzięki temu `prisma generate` działa jeszcze przed utworzeniem pliku .env
    url: process.env.DATABASE_URL ?? 'postgresql://nest:nest@localhost:5432/nest',
  },
});
