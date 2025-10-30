import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import { fixConfig } from './src/db/fix-config';
fixConfig();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
