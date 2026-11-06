# Raport: eksport użytkowników do CSV

Status: lokalnie (bez commitów)

## Zmienione pliki

* `src/users/users-csv.ts` (nowy), `src/users/users-csv.spec.ts` (nowy)
* `src/users/users.dto.ts`, `src/users/users.service.ts`, `src/users/users-admin.controller.ts`
* `test/http/admin-users-export.spec.ts` (nowy)

## Wyniki komend

* `npm run lint`: bez ostrzeżeń (jedno `no-misused-spread` w nowym specu poprawione)
* `npm test`: 8 plików, 39 testów przechodzi
* `npm run build`: przeszedł
* curl (port 3000): admin `200` + `text/csv; charset=utf-8`, 71 wierszy, bez BOM; `?status=BLOCKED` `200`; `?status=FOO` `400`; bez tokenu `401`

## Wymagania

| Wymaganie | Stan | Jak sprawdzone |
|---|---|---|
| R1 | spełnione | test HTTP, curl |
| R2 | spełnione | test HTTP, curl |
| R3 | spełnione | test HTTP, curl (71 wierszy) |
| R4 | spełnione | test jednostkowy, `xxd` |
| R5 | `401` spełnione; `403` tylko w teście HTTP | test HTTP, curl (`403` niesprawdzone na żywo) |
| R6 | spełnione | test jednostkowy |
| R7 | spełnione | test jednostkowy i HTTP |

## Problemy i odkrycia

* `user01@example.com` w bazie deweloperskiej jest zablokowany, więc nie nadaje się do sprawdzenia `403`.
* Odpowiedź logowania ma pole `token` (nie `accessToken`).
* Nest dla zwróconego stringa domyślnie ustawia `text/html`; `@Header('Content-Type', …)` to nadpisuje.
* `npx prettier --check` zgłasza uwagi w 9 plikach, także istniejących (nie ruszane).

## Niepewności i do zgłoszenia

* Eksport ładuje wszystkich użytkowników do pamięci (bez strumieniowania).
* `npm run check:a2` nie uruchamiany (robi to użytkownik).
