# Research: User photo upload

Status: do decyzji

## Założenia od użytkownika (odpowiedzi na pytania z wytycznych)
* Pliki lokalnie w `storage/`, w podkatalogu na uploady; katalog konfigurowalny (różne serwery, różne miejsca)
* Avatar przypisany do `Profile`
* Wgrywać może właściciel konta oraz administrator
* Formaty: podstawowe formaty zdjęć; limit 4 MB
* Zastąpienie avatara nie usuwa starego pliku
* Każdy upload = nowy rekord zdjęcia w bazie, przypisany do użytkownika, który uploaduje; rekord i plik zostają (pod przyszłą przeglądarkę zdjęć)
* Sposób testowania uploadu w testach HTTP: do zaproponowania (niżej)

## Co sprawdziłem
* `storage/` zawiera `data.json` i `NO-RULES.md`; cały katalog jest w `.gitignore` (`/storage`), więc uploady nie trafią do repo. Nic w `src/` nie odwołuje się dziś do `storage`.
* Konfiguracja: `src/config/config.service.ts` czyta zmienne przez `process.env`; wymagane przez `required()`, opcjonalne z domyślną (`PORT`). `.env.example` to szablon zmiennych. Nowa zmienna (np. `UPLOAD_DIR`) pasuje do tego wzorca, z domyślną `storage/uploads`.
* `package.json` ma już `@nestjs/platform-express` i `@types/multer`; `FileInterceptor`, `ParseFilePipe`, `MaxFileSizeValidator`, `FileTypeValidator` są w `@nestjs/common`. Nowe zależności niepotrzebne.
* Model `Profile` (`prisma/schema.prisma:33`): `displayName`, `bio`, `userId` unikalne. Profil jest opcjonalny w typie (`User.profile Profile?`), ale `AuthService.register` zawsze go tworzy (`src/auth/auth.service.ts:27`). Seed/stare konta mogą go nie mieć - do sprawdzenia przy implementacji.
* Widok: `userSelect` i `toUserView` w `src/users/user.view.ts` wybierają `profile.displayName`; avatar trzeba dodać do `userSelect` i `UserView`. Zmiana dotyka testów `user.view.spec.ts`, `users-csv.ts` (czyta `UserView`) i atrap w `test/http/*`.
* Autoryzacja: `@ApiAuth()` bez ról = tylko zalogowany (`/auth/me`), `@ApiAuth(RoleNames.ADMIN)` = tylko admin; `@Auth()` daje `AuthUser`. „Właściciel lub admin” wymaga sprawdzenia w serwisie/kontrolerze (brak gotowego dekoratora). Wzorzec: `UsersService` i `AuthUser` z rolami.
* Błędy: P2025 jest zamieniany na 404 przez filtr (komentarz w `users.service.ts:findOne`).
* Testy HTTP: `createTestApp(prisma)` buduje prawdziwy `AppModule` z atrapą Prismy; `supertest` jest zainstalowany. Test e2e z prawdziwą bazą: `test/support/db-app.ts`.
* `src/app.setup.ts` ma globalny `ValidationPipe` - nie wpływa na `multipart`, ale DTO z `@Body` przy uploadzie zadziała na polach tekstowych.

## Jak testować upload (propozycja)
* `supertest` obsługuje multipart: `.attach('file', Buffer.from(...), { filename: 'a.png', contentType: 'image/png' })`. Nie potrzeba plików na dysku w repo - bufor z prawdziwym nagłówkiem PNG (8 bajtów magic number) wystarcza.
* Atrapa Prismy dostaje `photo.create` jako `vi.fn()`, tak jak pozostałe metody (wzór: `test/http/admin-users.spec.ts`).
* Katalog uploadu w testach ustawiamy na tymczasowy (`os.tmpdir()` + `mkdtemp`) przez zmienną konfiguracji, a po testach go usuwamy (`afterAll`). Dzięki temu testy nie piszą do prawdziwego `storage/`.
* Przypadki: 401 bez tokenu; 201/200 poprawny PNG (plik fizycznie powstał w katalogu tymczasowym, `photo.create` wywołane z `userId`); 400 zły typ (np. plik tekstowy z `Content-Type: image/png`, jeśli sprawdzamy magic bytes); 413/400 plik > 4 MB (bufor 4 MB + 1); 403 obcy użytkownik; admin może dla innego.
* Test z prawdziwą bazą (`test/e2e`) jako uzupełnienie: pełny przepływ z rekordem `Photo` i relacją z `Profile`.

## Ryzyka
* **Prawdziwy typ pliku**: `Content-Type` i rozszerzenie pochodzą od klienta, można je podrobić. `FileTypeValidator` w Nest 11+ sprawdza magic bytes, ale trzeba to potwierdzić w zainstalowanej wersji (do weryfikacji w specyfikacji/implementacji).
* **Nazwa pliku**: nie wolno używać nazwy od klienta (path traversal, kolizje). Trzeba nazwy generowanej (np. UUID + rozszerzenie z wykrytego typu).
* **Brak profilu**: użytkownik bez rekordu `Profile` nie ma gdzie zapisać avatara.
* **Spójność plik/baza**: zapis pliku i rekordu nie są jedną transakcją; błąd bazy po zapisie pliku zostawia plik-sierotę (z założenia plików i tak nie usuwamy, ale warto to świadomie opisać).
* **Serwowanie**: sam zapis nic nie daje bez odczytu; wytyczne nie mówią, jak klient pobiera avatar.
* **Migracja**: nowy model + relacja wymaga `npm run db:migrate`; istniejących migracji nie edytujemy.
* **Pamięć**: multer z `memoryStorage` trzyma plik 4 MB w RAM na żądanie; akceptowalne przy limicie 4 MB.

## Decyzje
### 1. Endpoint uploadu
Jak ma wyglądać adres uploadu, skoro mogą go używać i właściciel, i admin.
* A. **(rekomendacja)** `POST /users/:id/avatar` (nowy kontroler `UsersController`, `@ApiAuth()`); dostęp gdy `:id` = zalogowany albo admin - jedna trasa dla obu przypadków.
* B. `POST /users/me/avatar` dla właściciela plus `POST /admin/users/:id/avatar` dla admina - dwa endpointy, prostsza autoryzacja każdego, więcej kodu.
* C. Tylko `POST /users/me/avatar`; admin wgrywa przez swoje konto - nie spełnia wymagania „administrator może wgrywać”.

### 2. Czyj jest rekord zdjęcia, gdy wgrywa admin
Wymaganie: rekord przypisany do użytkownika, który uploaduje. Przy uploadzie admina za kogoś trzeba rozstrzygnąć, czy to samo dotyczy avatara cudzego profilu.
* A. **(rekomendacja)** `Photo.userId` = uploadujący (zgodnie z wymaganiem), a `Profile.avatarId` wskazuje to zdjęcie; przeglądarka „moich zdjęć” pokaże zdjęcia właściciela konta wgrane przez niego samego, zdjęcia wgrane przez admina będą widoczne tylko przez avatar.
* B. `Photo.userId` = właściciel konta (target), a dodatkowe pole `uploadedById` = uploadujący - dokładniejszy ślad, jedna kolumna więcej.
* C. `Photo.userId` = uploadujący, bez dodatkowych pól i bez ograniczeń - to samo co A, ale bez wymogu, żeby avatar wskazywał zdjęcie tego samego właściciela.

### 3. Schemat bazy
Jak zapisać zdjęcia i powiązać z profilem.
* A. **(rekomendacja)** Model `Photo` (`id`, `userId` → `User`, `fileName` unikalna nazwa na dysku, `originalName`, `mimeType`, `size`, `createdAt`) oraz `Profile.avatarId Int?` → `Photo` (`onDelete: SetNull`) - aktualny avatar to wskaźnik, historia w tabeli.
* B. `Photo` bez `Profile.avatarId`; aktualny avatar = najnowszy rekord użytkownika - bez zmiany `Profile`, ale odczyt avatara wymaga dodatkowego zapytania i odbiera zdjęcie od wyboru avatara (przyszła przeglądarka zdjęć).
* C. Tylko pole `Profile.avatarPath` bez modelu `Photo` - sprzeczne z wymaganiem rekordu na każdy upload.

### 4. Odczyt avatara
Jak klient dostaje obraz (zapis jest zakresem zadania, odczyt wytyczne pomijają).
* A. **(rekomendacja)** `GET /users/:id/avatar` zwraca bajty obrazu (z `Content-Type`), dla zalogowanych; `UserView` dostaje `avatarUrl` (lub `null`) - minimum do sensownego użycia avatara.
* B. Tylko `avatarUrl` w `UserView` wskazujący na statyczny serwis plików (`ServeStaticModule`) - wymaga nowej zależności, plik dostępny publicznie bez autoryzacji.
* C. Poza zakresem: tylko zapis i `avatarId` w widoku, odczyt w osobnym zadaniu - najmniej kodu, avatara nie da się zobaczyć.

### 5. Konfiguracja katalogu
Nazwa zmiennej i wartość domyślna.
* A. **(rekomendacja)** `UPLOAD_DIR` w `ConfigService`, opcjonalna, domyślnie `storage/uploads` (względem katalogu uruchomienia), wpis w `.env.example`; katalog tworzony przy starcie, jeśli go nie ma.
* B. `UPLOAD_DIR` wymagana (przez `required()`) - brak domyślnej wymusza świadomy wybór na każdym serwerze, ale psuje start istniejących środowisk i testów.
* C. Stały katalog `storage/uploads` bez zmiennej - niezgodne z wymaganiem konfigurowalności.

### 6. Walidacja typu
Co dokładnie uznajemy za „podstawowe formaty zdjęć” i jak to sprawdzamy.
* A. **(rekomendacja)** JPEG, PNG, WebP, sprawdzane po magic bytes (nie po nagłówku klienta); inny typ → 400 z komunikatem po polsku. Rozszerzenie na dysku wynika z wykrytego typu.
* B. JPEG, PNG, WebP, GIF - jak A, plus animacje GIF jako avatar.
* C. Tylko po `Content-Type` od klienta - najprościej, ale łatwo obejść (plik tekstowy podpisany jako `image/png`).

### 7. Zachowanie przy przekroczeniu limitu i brakach
Kody błędów dla złych żądań.
* A. **(rekomendacja)** Plik > 4 MB → 413 (limit w multerze, bez wczytywania całego pliku); brak pliku → 400; zły typ → 400; cudzy `:id` bez roli admin → 403; nieistniejący użytkownik → 404; użytkownik bez profilu → 404 z komunikatem.
* B. Wszystkie błędy walidacji (łącznie z rozmiarem) jako 400 przez `ParseFilePipe` - jednolite 400, ale plik jest wczytany w całości przed odrzuceniem.
* C. Użytkownik bez profilu: profil tworzony automatycznie przy pierwszym uploadzie - więcej logiki w tym zadaniu.

## Odpowiedzi
(uzupełniane po odpowiedzi użytkownika)
