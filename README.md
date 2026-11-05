# nest-server (master-db)

Projekt startowy do części **Baza danych (Prisma)** szkolenia *Tworzenie aplikacji w Node.js z wykorzystaniem NestJS i TypeScript*.

To szkielet aplikacji: konfiguracja, Swagger, walidacja, JWT, guard i dekoratory, PostgreSQL w Dockerze razem z Adminerem oraz **gotowe kontrolery, DTO i moduły panelu administracyjnego**. Serwisy są puste (trasy zwracają 501) - ich zawartość, czyli całą pracę z bazą przez Prismę, piszemy podczas lekcji.

Pełna instrukcja przygotowania komputera: https://get.myflow.pl/nest/instalki

## Wymagania

- Node.js 24 LTS (minimum 22.18)
- Git
- Docker (Docker Desktop, Rancher Desktop, OrbStack lub Podman z `docker compose`)

## Pierwsze uruchomienie

```bash
npm install
cp .env.example .env     # Windows (PowerShell): Copy-Item .env.example .env
npm run db:up            # PostgreSQL + Adminer w Dockerze
npm run db:check         # test połączenia Node.js -> PostgreSQL
npm run start:dev        # http://localhost:3000 zwraca "Hello World!"
```

- Swagger: http://localhost:3000/docs
- Adminer (podgląd bazy w przeglądarce): http://localhost:8080 (System: PostgreSQL, Serwer: `db`, Użytkownik: `nest`, Hasło: `nest`, Baza: `nest`)

## Co jest w projekcie

| Plik / katalog | Do czego służy |
|---|---|
| `src/config/` | typowany `ConfigService` (czyta `.env`), moduł globalny |
| `src/auth/` | `AuthService` (podpis i weryfikacja JWT; `register`, `login` i `authenticate` do uzupełnienia), `AuthController`, DTO, `JwtAuthGuard`, dekoratory `@Auth()`, `@Roles()`, `@ApiAuth()` |
| `src/users/` | kontroler panelu administratora (`/admin/users`), DTO i pusty `UsersService` |
| `src/stats/` | kontroler `/admin/stats` i pusty `StatsService` |
| `scripts/check.mjs` | sprawdziany `npm run check:d1` ... `check:d7` |
| `prisma/fixtures.ts` | gotowe dane demonstracyjne do seeda (50 użytkowników) |
| `scripts/n-plus-one.ts`, `scripts/last-admin-race.ts` | skrypty demonstracyjne: N+1 (dodatek do D4) i wyścig administratorów (D7); zadziałają po wykonaniu tych lekcji |
| `src/main.ts` | Swagger (`/docs`), globalny `ValidationPipe` |
| `compose.yaml` | PostgreSQL 18 i Adminer |
| `.env.example` | szablon konfiguracji (port, sekret JWT, adres bazy) |

Metody serwisów rzucają `NotImplementedException` (HTTP 501) - zastąpimy je w lekcjach D2-D7, gdy pojawi się baza. Błędy TypeScripta w skryptach `scripts/*.ts` są normalne aż do lekcji D3: brakuje wygenerowanego klienta Prismy, a potem modeli, których używają (`Profile`, `Role`).

## Skrypty

| Skrypt | Opis |
|---|---|
| `npm run start:dev` | serwer w trybie watch |
| `npm run build` | kompilacja do `dist/` |
| `npm test` | testy jednostkowe (Vitest) |
| `npm run lint` | lint (oxlint) |
| `npm run db:up` / `db:down` | start / stop bazy w Dockerze |
| `npm run db:check` | test połączenia z bazą |

Skrypty `db:*` (`db:migrate`, `db:studio`, `db:seed`, `db:reset` ...) są już w `package.json` - zaczną działać, gdy w lekcjach pojawi się schemat Prismy.

Po każdej lekcji możesz sprawdzić swoją pracę jednym poleceniem (serwer musi działać): `npm run check:d2` ... `npm run check:d7`. Skrypt wykonuje scenariusz z lekcji i wypisuje ✓ albo ✗ przy każdym punkcie.
