# nest-server (master-db)

Projekt startowy do części **Baza danych (Prisma)** szkolenia *Tworzenie aplikacji w Node.js z wykorzystaniem NestJS i TypeScript*.

To szkielet infrastruktury **bez kodu domeny**: konfiguracja, Swagger, walidacja, JWT, guard i dekoratory, PostgreSQL w Dockerze razem z Adminerem. Użytkowników, bazę i panel administracyjny budujemy podczas lekcji.

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
| `src/auth/` | `AuthService` (podpis i weryfikacja JWT), `JwtAuthGuard`, dekoratory `@Auth()`, `@Roles()`, `@ApiAuth()` |
| `src/main.ts` | Swagger (`/docs`), globalny `ValidationPipe` |
| `compose.yaml` | PostgreSQL 18 i Adminer |
| `.env.example` | szablon konfiguracji (port, sekret JWT, adres bazy) |

Metoda `AuthService.authenticate()` jest pusta - uzupełnimy ją w lekcji D2, gdy pojawi się baza.

## Skrypty

| Skrypt | Opis |
|---|---|
| `npm run start:dev` | serwer w trybie watch |
| `npm run build` | kompilacja do `dist/` |
| `npm test` | testy jednostkowe (Vitest) |
| `npm run lint` | lint (oxlint) |
| `npm run db:up` / `db:down` | start / stop bazy w Dockerze |
| `npm run db:check` | test połączenia z bazą |

Dalsze skrypty (`db:migrate`, `db:studio`, `db:seed`...) dodajemy w lekcjach.
