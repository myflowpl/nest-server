# nest-server (master-extra)

Projekt startowy do modułu **Extra: WebSockets i mikroserwisy** szkolenia *Tworzenie aplikacji w Node.js z wykorzystaniem NestJS i TypeScript*.

To gotowy panel administracyjny z modułu **Baza danych (Prisma)** (JWT, role, użytkownicy, dziennik zdarzeń) plus infrastruktura modułu: Redis w Dockerze, strona do „klikania” zdarzeń WebSocket (`public/`) i skrypty kontroli lotu. Kodu bramki WebSocket, uploadu i workera **jeszcze nie ma** - piszemy go w rozdziałach E1-E6.

Pełna instrukcja przygotowania komputera: https://get.myflow.pl/nest/instalki

## Pierwsze uruchomienie

```bash
npm install
cp .env.example .env     # Windows (PowerShell): Copy-Item .env.example .env
npm run db:up            # PostgreSQL + Adminer + Redis w Dockerze
npm run db:migrate       # schemat bazy
npm run db:seed          # administrator i 50 użytkowników
npm run start:dev        # http://localhost:3000
```

- Konsola WebSocket (UI): http://localhost:3000/ui/
- Swagger: http://localhost:3000/docs
- Konta z seeda: `admin@example.com` / `admin123`, `user01@example.com` / `password123`

## Co jest w projekcie

| Plik / katalog | Do czego służy |
|---|---|
| `public/index.html` | konsola do klikania: logowanie, połączenie, zdarzenia, obecność, upload zdjęcia, dziennik zdarzeń |
| `src/main.ts` | Swagger, `ValidationPipe`, serwowanie `public/` pod `/ui` |
| `src/config/` | `ConfigService` z `REDIS_URL` i `STORAGE_DIR` |
| `compose.yaml` | PostgreSQL 18, Adminer, Redis 8 |
| `scripts/check-extra.mjs` | kontrola lotu `npm run check:e1` ... `check:e6` |
| `scripts/big-image.mjs` | `npm run extra:big-image`: duże zdjęcie testowe w `storage/demo/big.jpg` (do testu limitu 5 MB) |
| `scripts/broken-image.mjs` | `npm run extra:broken-image`: uszkodzony PNG w `storage/demo/uszkodzone.png` (E6) |
| `src/auth/`, `src/users/`, `prisma/` | panel administratora z modułu bazy danych |

## Skrypty modułu

| Komenda | Co robi |
|---|---|
| `npm run start:dev` | API (HTTP + WebSocket) |
| `npm run start:worker` | worker miniaturek (od rozdziału E4) |
| `npm run check:e1` ... `check:e6` | kontrola lotu rozdziału |
