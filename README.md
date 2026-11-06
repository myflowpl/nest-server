# nest-server (master-ai)

Projekt startowy do modułu **Praca z AI** szkolenia *Tworzenie aplikacji w Node.js z wykorzystaniem NestJS i TypeScript*.

To panel administracyjny użytkowników z modułów o bazie danych i testach (PostgreSQL, Prisma, JWT, role, lista, blokowanie, statystyki, testy jednostkowe, HTTP i z bazą) oraz **skrypty modułu o agentach AI**. Pliki dla agenta (`AGENTS.md`, `CLAUDE.md`, `.mcp.json`, `.claude/`, `tasks/`) tworzymy podczas rozdziałów A1-A5.

Pełna instrukcja przygotowania komputera: https://get.myflow.pl/nest/instalki

## Pierwsze uruchomienie

```bash
npm install
cp .env.example .env     # Windows (PowerShell): Copy-Item .env.example .env
npm run db:up            # PostgreSQL + Adminer w Dockerze
npm run db:migrate       # schemat bazy
npm run db:seed          # dane startowe
npm test                 # testy jednostkowe i HTTP
```

## Skrypty modułu

| Komenda | Rozdział | Co robi |
|---|---|---|
| `npm run check:a1` ... `check:a5` | A1-A5 | Kontrola lotu: sprawdza **wynik pracy w repozytorium** (pliki, zachowanie aplikacji, uprawnienia bazy), bez względu na to, jakiego agenta użyłeś |
| `npm run ai:db-role` | A3 | tworzy w bazie rolę `agent_ro` (tylko odczyt, bez `User.passwordHash`) według `scripts/ai-db-role.sql` |
| `npm run ai:mcp-config` | A3 | generuje `dbhub.toml` (konfiguracja serwera MCP; zawiera hasło, jest w `.gitignore`) |
| `npm run ai:pr-agenta` | A5 | dodaje „PR od agenta” (moduł `src/audit`) do przeglądu |

`check:a2`, `check:a4` i `check:a5` potrzebują działającego serwera (`npm run start:dev`) i bazy.
