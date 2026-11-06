# Research: eksport użytkowników do CSV

Status: research gotowy

> Uwaga: research powstał po realizacji zadania (workflow dopisany później). Decyzje 1-4 były przedstawione użytkownikowi przy planie, który zatwierdził je bez zmian (rekomendacje), więc „Odpowiedzi” opisują stan faktyczny. Decyzja 5 wyszła przy odtwarzaniu researchu.

## Co sprawdziłem

* `GET /admin/users` i wzór kontrolera: [users-admin.controller.ts](../../src/users/users-admin.controller.ts); `@ApiAuth(RoleNames.ADMIN)` stoi na klasie, więc nowa trasa dostaje `401`/`403` bez dodatkowego kodu.
* Trasy stałe muszą stać przed `@Get(':id')` (AGENTS.md); inaczej `export` trafia do `ParseIntPipe` i daje `400`.
* `UsersService.list` ([users.service.ts](../../src/users/users.service.ts)): filtr `status` budowany przez `...(status && { status })`; stronicowanie przez `skip`/`take`.
* `ListUsersQueryDto` ([users.dto.ts](../../src/users/users.dto.ts)) ma `pageSize` z `@Max(50)` i domyślne wartości, więc nie nadaje się do eksportu bez stronicowania.
* `userSelect` i `toUserView` ([user.view.ts](../../src/users/user.view.ts)) nie zawierają `passwordHash`, więc CSV zbudowane z `UserView` go nie wyniesie.
* `ValidationPipe` w [app.setup.ts](../../src/app.setup.ts): `transform: true, whitelist: true` (bez `forbidNonWhitelisted`). Parametry spoza DTO są po cichu odrzucane (nie dają `400`), a zły `status` daje `400` przez `@IsIn`. Testy HTTP używają tej samej konfiguracji (`createTestApp`).
* Wzór testu HTTP: [admin-users.spec.ts](../../test/http/admin-users.spec.ts).
* Dane seeda: `admin@example.com` / `admin123`; `user01..user50@example.com` / `password123`, ale w bazie deweloperskiej `user01` bywa zablokowany.

## Ryzyka

* Nest dla zwróconego stringa ustawia domyślnie `text/html`; potrzebny `@Header('Content-Type', …)`.
* Cały zbiór ładowany do pamięci jednym `findMany`; dla panelu administracyjnego akceptowalne, ale nie skaluje się bez końca.
* `\r` na początku pola trzeba najpierw poprzedzić apostrofem, a dopiero potem ocenić potrzebę cudzysłowu (kolejność z wymagań).
* Ręczne sprawdzenie `403` wymaga aktywnego konta zwykłego użytkownika.

## Decyzje

### 1. Znak końca ostatniego wiersza
Wymagania mówią, że wiersze są rozdzielone nową linią, ale nie czy po ostatnim też ma być.
* A. **(rekomendacja)** Bez końcowego `\n`: dosłownie „rozdzielone”, pusta lista daje sam nagłówek.
* B. Z końcowym `\n`: częsta konwencja, ale dodatkowy znak spoza opisu.

### 2. `\r` w środku pola
`\r` na początku pola dostaje apostrof; nie wiadomo, czy w środku wymusza cudzysłów.
* A. **(rekomendacja)** Traktuję `\r` jak nową linię i cytuję pole (zgodne z RFC 4180).
* B. Cytuję tylko przy `\n`: dosłowna lektura, ale część parserów może zepsuć wiersz.

### 3. Kolejność wierszy
Wymagania nie określają sortowania.
* A. **(rekomendacja)** `id` rosnąco: stabilne i przewidywalne.
* B. `createdAt` malejąco jak `GET /admin/users`: spójne z listą, rzadko wygodne w pliku.

### 4. `Content-Disposition: attachment`
Bez niego przeglądarka może pokazać CSV zamiast go pobrać.
* A. **(rekomendacja)** Nie dodaję: wymagania go nie żądają.
* B. Dodaję `attachment; filename="users.csv"`: wygodniejsze, jedna linia i jeden asert więcej.

### 5. Osobne DTO zapytania
`ListUsersQueryDto` ma limit `pageSize` 50 i domyślne strony, a eksport ma obejmować wszystkich.
* A. **(rekomendacja)** Osobne `ExportUsersQueryDto` tylko ze `status`: żadnych parametrów stronicowania, nieznane parametry odrzuca `whitelist`.
* B. Użyć `ListUsersQueryDto` i ignorować stronicowanie: mniej kodu, ale Swagger pokazywałby parametry, które nic nie robią, i `pageSize=100` dawałoby `400`.

## Odpowiedzi

* 1A, 2A, 3A, 4A: zatwierdzone razem z planem (2026-11-06).
* 5A: przyjęte w implementacji (osobne DTO); do potwierdzenia przez użytkownika.
