# nest-server (master-testy)

Projekt startowy do modułu **Testy** szkolenia *Tworzenie aplikacji w Node.js z wykorzystaniem NestJS i TypeScript*.

To panel administracyjny użytkowników z modułu o bazie danych (stan po rozdziale D7: PostgreSQL, Prisma, JWT, role, lista, blokowanie, statystyki) oraz **infrastruktura testów**, ale bez testów poza przykładem z NestJS. Testy piszemy podczas rozdziałów T1-T3.

Pełna instrukcja przygotowania komputera: https://get.myflow.pl/nest/instalki

## Pierwsze uruchomienie

```bash
npm install
cp .env.example .env     # Windows (PowerShell): Copy-Item .env.example .env
npm run db:up            # PostgreSQL + Adminer w Dockerze (potrzebne do testów z bazą)
npm test                 # testy jednostkowe i HTTP (bez bazy)
```

## Komendy testów

| Komenda | Co robi |
|---|---|
| `npm test` | testy jednostkowe i HTTP z atrapą bazy (`src/**/*.spec.ts`, `test/http`) |
| `npm run test:e2e` | testy z prawdziwą bazą (`test/e2e`), baza testowa `<nazwa>_test` |
| `npm run test:cov` | testy z raportem pokrycia kodu |
| `npm run check:t1` ... `check:t3` | Kontrola lotu: uruchamia testy i psuje kod aplikacji, żeby sprawdzić, czy testy to wykrywają |

## Co jest w projekcie

| Plik / katalog | Do czego służy |
|---|---|
| `src/app.setup.ts` | `setupApp()`: wspólna konfiguracja aplikacji (walidacja) dla `main.ts` i testów |
| `vitest.config.ts`, `vitest.config.e2e.ts` | konfiguracje testów (bez bazy i z bazą) |
| `test/global-setup.ts` | przed testami z bazą: tworzy bazę testową, wykonuje migracje i seed |
| `test/support/test-database.ts` | adres bazy testowej z `.env` |
| `scripts/check-tests.mjs` | Kontrola lotu |
| `src/`, `prisma/`, `scripts/check.mjs` | aplikacja i skrypty z modułu o bazie danych |
