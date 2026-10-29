# nest-server

Projekt startowy do szkolenia **Tworzenie aplikacji w Node.js z wykorzystaniem NestJS i TypeScript**.

Czysty projekt wygenerowany przez `nest new` (NestJS 12), z doinstalowanymi paczkami, których użyjemy na szkoleniu, oraz bazą PostgreSQL uruchamianą w Dockerze.

Pełna instrukcja przygotowania komputera: https://get.myflow.pl/nest/instalki

## Wymagania

- Node.js 24 LTS (minimum 22.18)
- Git
- Docker (Docker Desktop, Rancher Desktop, OrbStack lub Podman z `docker compose`)

## Uruchomienie

```bash
npm install

# serwer developerski – http://localhost:3000 zwraca "Hello World!"
npm run start:dev

# baza PostgreSQL w Dockerze
docker compose up -d

# test połączenia Node.js -> PostgreSQL
npm run db:check
```

Zatrzymanie bazy: `docker compose down` (dane zostają w wolumenie `db-data`).

## Konfiguracja

Domyślne ustawienia działają bez pliku `.env`. Jeśli port `5432` jest zajęty, skopiuj `.env.example` jako `.env` i zmień `POSTGRES_PORT` oraz port w `DATABASE_URL`.

## Skrypty

| Skrypt | Opis |
|---|---|
| `npm run start:dev` | serwer w trybie watch |
| `npm run build` | kompilacja do `dist/` |
| `npm test` | testy jednostkowe (Vitest) |
| `npm run test:e2e` | testy e2e (Vitest + Supertest) |
| `npm run lint` | lint (oxlint) |
| `npm run db:up` / `db:down` | start / stop bazy w Dockerze |
| `npm run db:check` | test połączenia z bazą |
