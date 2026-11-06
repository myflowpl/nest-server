import { defineConfig } from 'vitest/config';

// Testy jednostkowe i testy HTTP z atrapą bazy: szybkie, bez prawdziwej bazy danych.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts', 'test/http/**/*.spec.ts'],
    // AppModule wymaga tych zmiennych, ale testy z atrapą nie łączą się z bazą
    env: { DATABASE_URL: 'postgresql://nest:nest@localhost:5432/unused', JWT_SECRET: 'test-secret' },
    coverage: { provider: 'v8', include: ['src/**/*.ts'], exclude: ['src/generated/**', 'src/main.ts', '**/*.spec.ts'] },
  },
});
