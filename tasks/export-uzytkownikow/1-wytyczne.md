# Eksport użytkowników do CSV

Status: wytyczne

## Cel

Administrator pobiera listę użytkowników jako plik CSV: `GET /admin/users/export`, opcjonalnie z filtrem `?status=ACTIVE` albo `?status=BLOCKED`.

## Kontekst

* `src/users/users-admin.controller.ts`: wzór endpointu `GET /admin/users` (guard, dekorator `@ApiAuth(RoleNames.ADMIN)`, kolejność tras)
* `src/users/users.service.ts`: `UsersService.list`, wzór zapytania z filtrem `status`
* `src/users/user.view.ts`: `toUserView` i `userSelect`; do API nie zwracamy rekordu Prismy (zawiera `passwordHash`)
* `test/http/admin-users.spec.ts`: wzór testu HTTP (`createTestApp`, atrapa Prismy, token z `AuthService`)
* `AGENTS.md`: trasy stałe przed `@Get(':id')`, importy z `.js`, Vitest

## Wstępne wymagania

* Odpowiedź `200` z `Content-Type: text/csv`; pierwszy wiersz `id,email,displayName,status,createdAt`, potem jeden wiersz na użytkownika
* Nieznany `status` kończy się `400`
* Eksport obejmuje wszystkich użytkowników (z filtrem `status`), bez stronicowania; `GET /admin/users` ma limit 50 na stronę
* UTF-8 bez BOM, wiersze rozdzielone znakiem nowej linii
* Dostęp tylko dla administratora: `401` bez tokenu, `403` dla zwykłego użytkownika
* Pole zaczynające się od `=`, `+`, `-`, `@`, tabulatora lub `\r` poprzedzone apostrofem (ochrona przed formułami w Excelu), a potem, jeśli pole ma przecinek, cudzysłów lub nową linię, ujęte w cudzysłów
* `passwordHash` nigdy nie trafia do pliku
* Test jednostkowy zamiany użytkowników na CSV oraz sprawdzenie `GET /admin/users/export` na działającym serwerze

## Poza zakresem

* Zmiany schematu bazy, migracje, nowe biblioteki, zmiany `package.json`
* Zmiany poza `src/users/` i `test/`

## Pytania do researchu

* Czy po ostatnim wierszu ma być znak nowej linii?
* Czy `\r` w środku pola wymusza cudzysłów, czy tylko `\n`?
* W jakiej kolejności mają być wiersze?
* Czy odpowiedź ma mieć `Content-Disposition: attachment`?
* Czy walidacja zapytania pozwoli użyć osobnego DTO tylko z `status` (konfiguracja `ValidationPipe`)?
