# Raport: User photo upload

Status: lokalnie

## Zmienione pliki
* `prisma/schema.prisma`, `prisma/migrations/20261106100000_photo_avatar/migration.sql` - `Photo`, `Profile.avatarId`
* `src/config/config.service.ts`, `.env.example` - `UPLOAD_DIR`
* `src/users/image-type.ts` (+ spec) - rozpoznanie JPEG/PNG/WebP po magic bytes
* `src/users/avatar.service.ts`, `src/users/users.controller.ts`, `src/users/users.module.ts` - upload i pobranie
* `src/users/user.view.ts` (+ spec), `src/users/users-csv.spec.ts` - `avatarUrl`
* `src/types/express.d.ts` - import typów multera
* `test/http/user-avatar.spec.ts`, `test/e2e/avatar.e2e-spec.ts` - testy

## Wyniki komend
* `npm run lint`: bez błędów i ostrzeżeń; `npx tsc --noEmit` czysto; `npm run build` przechodzi
* `npm test`: 10 plików, 57 testów zielone
* `npm run test:e2e`: 2 pliki, 6 testów zielone (migracja zastosowana na bazie `nest_test`)
* Ręczny test przez Swagger: NIE wykonany (patrz niżej)

## Wymagania
| Wymaganie | Stan | Jak sprawdzone |
|---|---|---|
| R1 model + migracja | spełnione | e2e (zapis/odczyt `Photo`, migracja na `nest_test`) |
| R2 `UPLOAD_DIR` | spełnione | test HTTP: katalog tymczasowy, tworzony automatycznie |
| R3 401 bez tokenu | spełnione | test HTTP |
| R4 właściciel / admin / obcy | spełnione | trzy testy HTTP, e2e dla admina |
| R5 zapis pliku, `Photo`, avatar, stare zostają | spełnione | test HTTP i e2e (2 uploady = 2 rekordy, 2 pliki) |
| R6 typ po magic bytes | spełnione | test HTTP (tekst jako `image/png` → 400), `image-type.spec.ts` |
| R7 limit 4 MB, brak pliku | spełnione | testy HTTP (4 MB + 1 → 413, dokładnie 4 MB → 201, brak → 400) |
| R8 404 | spełnione | test HTTP (brak profilu / użytkownika) |
| R9 GET avatara | spełnione | testy HTTP i e2e (bajty, `Content-Type`, 404, 401) |
| R10 `avatarUrl` | spełnione | `user.view.spec.ts`, testy HTTP |
| R11 Swagger multipart | niesprawdzone | opis dodany (`@ApiConsumes`, `@ApiBody`), nie oglądany w `/docs` |

## Commity
* 274df2c Photo i Profile.avatarId: schemat i migracja (pusty plik SQL, poprawiony niżej)
* Migracja photo_avatar: właściwa treść SQL
* UPLOAD_DIR w konfiguracji i testy avatara (czerwone)
* Upload i pobieranie avatara: POST/GET /users/:id/avatar, avatarUrl w widoku
* (ostatni) test e2e avatara i raport

## Problemy i odkrycia
* `prisma migrate dev` zażądał resetu bazy deweloperskiej (historia migracji różni się od katalogu), więc go nie użyłem. SQL wygenerowałem przez `prisma migrate diff` (schemat z HEAD → nowy). **Baza deweloperska nie ma tej migracji** - zanim uruchomisz serwer lokalnie, trzeba ją zastosować (`prisma migrate deploy`, może zgłosić tę samą rozbieżność).
* Pierwszy commit migracji miał pusty `migration.sql` (błąd `sed`); poprawiony osobnym commitem.
* `npm run db:up` zgłasza `failed to read .env: line 1: key cannot contain a space` (docker compose); `.env` nie był czytany. Kontenery bazy już działały.
* Multer czyta nazwę pliku jako latin1 - polskie znaki w `originalName` były psute; naprawione (`avatar.service.ts`), pokryte testem.
* Odstępstwo od R5: zamiast osobnych `photo.create` i `profile.update` jest jedno `profile.update` z zagnieżdżonym `avatar.create` (atomowo, bez transakcji). Przy błędzie bazy plik jest usuwany.
* `Photo.userId` ma `onDelete: Cascade`: usunięcie użytkownika kasuje rekordy jego zdjęć (pliki na dysku zostają). Zdjęcie wgrane przez admina innemu znika razem z adminem, a `Profile.avatarId` przechodzi w `null`.

## Niepewności i do zgłoszenia
* Nie zweryfikowałem ręcznie w Swaggerze ani na bazie deweloperskiej (brak migracji tam, patrz wyżej).
* Pliki-sieroty (po usunięciu użytkownika) zostają na dysku - zgodnie z założeniem, ale przyszła przeglądarka zdjęć powinna to uwzględnić.
