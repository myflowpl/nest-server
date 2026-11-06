import { defineConfig } from 'vitest/config';
import { testDatabaseUrl } from './test/support/test-database.js';

// Testy z prawdziwą bazą PostgreSQL (baza testowa `<nazwa>_test`): wolniejsze, więc osobna komenda.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['test/e2e/**/*.e2e-spec.ts'],
    globalSetup: ['./test/global-setup.ts'],
    fileParallelism: false, // jedna baza, więc pliki testów idą po kolei
    env: { DATABASE_URL: testDatabaseUrl(), JWT_SECRET: 'test-secret' },
    coverage: { provider: 'v8', include: ['src/**/*.ts'], exclude: ['src/generated/**', 'src/main.ts', '**/*.spec.ts'] },
  },
});
