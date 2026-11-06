# User photo upload

Status: specyfikacja

## Cel
Właściciel konta lub administrator może wgrać avatar użytkownika (`POST /users/:id/avatar`). Plik trafia na dysk do konfigurowalnego katalogu, każdy upload tworzy rekord `Photo`, a aktualny avatar profilu wskazuje to zdjęcie i można go pobrać (`GET /users/:id/avatar`).

## Kontekst
* `tasks/user-photo-upload/1-wytyczne.md`, `2-research.md` (wszystkie decyzje zatwierdzone)
* Wzorce: `src/users/users-admin.controller.ts`, `src/users/users.service.ts`, `src/users/user.view.ts`, `src/config/config.service.ts`, `test/http/admin-users.spec.ts`

## Decyzje
* 1A → jedna trasa `POST /users/:id/avatar`, `@ApiAuth()`, dostęp: ten sam użytkownik albo admin
* 2A → `Photo.userId` = uploadujący; `Profile.avatarId` wskazuje zdjęcie
* 3A → model `Photo` + `Profile.avatarId Int?` (`onDelete: SetNull`)
* 4A → `GET /users/:id/avatar` zwraca bajty; `UserView.avatarUrl`
* 5A → `UPLOAD_DIR`, opcjonalna, domyślnie `storage/uploads`
* 6A → JPEG, PNG, WebP po magic bytes
* 7A → kody błędów jak niżej (413 / 400 / 403 / 404)

## Wymagania
* R1. Model `Photo` (`id`, `userId` → `User`, `fileName` unikalna, `originalName`, `mimeType`, `size`, `createdAt`) i `Profile.avatarId Int?` → `Photo` (`onDelete: SetNull`); nowa migracja → sprawdzenie: `npm run db:migrate` przechodzi, test e2e zapisuje i czyta `Photo`.
* R2. `ConfigService.UPLOAD_DIR`: z env, domyślnie `storage/uploads`; wpis w `.env.example`; katalog tworzony, jeśli nie istnieje → sprawdzenie: test jednostkowy/HTTP z `UPLOAD_DIR` w katalogu tymczasowym, plik tam powstaje.
* R3. `POST /users/:id/avatar` (multipart, pole `file`) bez tokenu → 401 → sprawdzenie: test HTTP.
* R4. Zalogowany użytkownik wgrywa avatar sobie → sukces; administrator wgrywa innemu → sukces; zwykły użytkownik innemu → 403 → sprawdzenie: trzy testy HTTP.
* R5. Poprawny upload: plik zapisany w `UPLOAD_DIR` pod wygenerowaną nazwą (UUID + rozszerzenie z wykrytego typu, nigdy nazwa klienta), `Photo` utworzone z `userId` = uploadujący, `Profile.avatarId` ustawione; stare zdjęcia i pliki nie są usuwane → sprawdzenie: test HTTP (plik istnieje, `photo.create` i `profile.update` wywołane z oczekiwanymi danymi), test e2e (dwa uploady = dwa rekordy i dwa pliki).
* R6. Dozwolone tylko JPEG, PNG, WebP rozpoznane po magic bytes; inny typ (też tekst z `Content-Type: image/png`) → 400 z komunikatem po polsku; plik nie powstaje → sprawdzenie: test HTTP.
* R7. Plik > 4 MB (4 MB + 1 bajt) → 413; brak pliku → 400 → sprawdzenie: dwa testy HTTP.
* R8. Nieistniejący użytkownik → 404; użytkownik bez profilu → 404 z komunikatem po polsku; plik nie zostaje zapisany → sprawdzenie: dwa testy HTTP.
* R9. `GET /users/:id/avatar` (zalogowany) zwraca bajty aktualnego avatara z właściwym `Content-Type`; brak avatara lub użytkownika → 404; bez tokenu → 401 → sprawdzenie: testy HTTP.
* R10. `UserView` ma `avatarUrl` (`/users/<id>/avatar` albo `null`), a `userSelect` pobiera `profile.avatarId`; `passwordHash` nadal nie wycieka; istniejące testy widoku, CSV i HTTP przechodzą → sprawdzenie: `npm test`, zaktualizowany `user.view.spec.ts`.
* R11. Swagger: endpoint opisany jako `multipart/form-data` z polem `file` (`@ApiConsumes`, `@ApiBody`) → sprawdzenie: `/docs` pokazuje pole pliku.

## Poza zakresem
* Usuwanie plików i zdjęć, przeglądarka zdjęć, wybór innego zdjęcia jako avatara
* Przycinanie/skalowanie, GIF, magazyny zewnętrzne, frontend
* Automatyczne tworzenie brakującego profilu

## Granice
* Zmiany tylko w `src/users/`, `src/config/`, `prisma/schema.prisma` (+ nowa migracja), `.env.example`, `test/`
* Testy zapisują wyłącznie do katalogu tymczasowego (`os.tmpdir()`), nigdy do prawdziwego `storage/`
* Zapis pliku przez `multer` z `memoryStorage` i limitem `fileSize` 4 MB; plik na dysk trafia dopiero po przejściu walidacji typu i użytkownika/profilu

## Dane do weryfikacji
* Admin: `admin@example.com` / `admin123`; zwykli: `user01..user50@example.com` / `password123` (seed, wszyscy mają profil)
* Pułapka: konto admina z seeda bywa zablokowane po `npm run db:race`; baza musi działać (`npm run db:up`), seed (`npm run db:seed`)
* Pułapka: `db:playground` i `db:race` nie uruchamiamy

## Weryfikacja
* Ponad `npm run lint` i `npm test`: `npm run test:e2e` (zmiana schematu), `npm run build`
* Ręcznie (`npm run start:dev`): logowanie jako `user01`, `POST /users/<id>/avatar` małym PNG w Swaggerze, potem `GET /users/<id>/avatar`; plik widoczny w `storage/uploads`

## Raport
Zapisz w `4-raport.md` (patrz `/task-implement`).
