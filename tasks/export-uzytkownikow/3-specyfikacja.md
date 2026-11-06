# Eksport użytkowników do CSV

Status: zrealizowane lokalnie (raport w `4-raport.md`)

## Cel

Administrator pobiera listę użytkowników jako plik CSV: `GET /admin/users/export`, opcjonalnie z filtrem `?status=ACTIVE` albo `?status=BLOCKED`.

## Kontekst

* Wzór: `GET /admin/users` w `src/users/users-admin.controller.ts` i `UsersService.list`.
* Widok użytkownika: `toUserView` w `src/users/user.view.ts`.
* Reguły projektu: `AGENTS.md`.

## Decyzje

* Brak końcowego `\n` po ostatnim wierszu.
* `\r` w środku pola wymusza cudzysłów (jak `\n`).
* Kolejność wierszy: `id` rosnąco.
* Bez nagłówka `Content-Disposition`.

## Wymagania

* R1. Odpowiedź `200` z `Content-Type: text/csv`; pierwszy wiersz `id,email,displayName,status,createdAt`, potem wiersz na użytkownika → test HTTP, curl
* R2. Nieznany `status` kończy się `400` → test HTTP, curl
* R3. Eksport obejmuje wszystkich użytkowników (z filtrem `status`), bez stronicowania (`GET /admin/users` ma limit 50) → test HTTP (brak `take`/`skip`), curl (>50 wierszy)
* R4. UTF-8 bez BOM, wiersze rozdzielone `\n` → test jednostkowy, `xxd`
* R5. Tylko administrator: `401` bez tokenu, `403` dla zwykłego użytkownika → test HTTP
* R6. Pole zaczynające się od `=`, `+`, `-`, `@`, tabulatora lub `\r` poprzedź apostrofem, a potem, jeśli pole ma przecinek, cudzysłów lub nową linię, ujmij je w cudzysłów → test jednostkowy
* R7. `passwordHash` nigdy nie trafia do pliku → test jednostkowy i HTTP

## Poza zakresem

* Strumieniowanie dużych eksportów, `Content-Disposition`, filtry inne niż `status`.

## Granice

* Zmieniaj tylko pliki w `src/users/` i `test/`.

## Dane do weryfikacji

* Admin z seeda: `admin@example.com` / `admin123`.
* Uwaga: `user01@example.com` w bazie deweloperskiej bywa zablokowany (logowanie daje `403`), więc do ręcznego sprawdzenia `403` potrzebne jest aktywne konto zwykłego użytkownika (np. zarejestrowane przez `POST /auth/register`).
* Port serwera: z `.env` (nie czytaj pliku); sprawdź w logu `start:dev` lub przez `lsof -iTCP -sTCP:LISTEN`.

## Weryfikacja

* Ręcznie `GET /admin/users/export` na działającym serwerze (curl albo Swagger).
* `npm run check:a2` uruchamia użytkownik.
