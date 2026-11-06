# User photo upload

Status: wytyczne

## Cel
Możliwość wgrania (uploadu) avatara użytkownika. Dokładny endpoint, miejsce przechowywania i to, kto może wgrywać, są do ustalenia w researchu.

## Kontekst
* `src/users/users-admin.controller.ts` - wzorzec endpointów użytkowników (`@ApiAuth`, kolejność tras stałych przed `:id`)
* `src/users/users.service.ts`, `src/users/user.view.ts` - serwis i widok użytkownika (do API nie zwracamy rekordu Prismy)
* `test/http/admin-users.spec.ts` - wzór testów HTTP (`createTestApp`)
* `prisma/schema.prisma` - model `Profile` (`displayName`, `bio`) jako kandydat na miejsce pola avatara
* W `package.json` są już `@nestjs/platform-express` i `@types/multer`, więc nowe zależności prawdopodobnie niepotrzebne (zakaz dodawania bez prośby)
* `AGENTS.md`: nie edytować istniejących migracji ani `src/generated/`; zmiana schematu przez `npm run db:migrate`

## Wstępne wymagania
* Użytkownik może wgrać plik graficzny jako swój avatar
* Niedozwolony typ pliku lub zbyt duży plik jest odrzucany z czytelnym komunikatem po polsku
* Widok użytkownika (`toUserView`) informuje o avatarze, bez wycieku `passwordHash`
* Endpoint wymaga uwierzytelnienia
* Testy HTTP pokrywają poprawny upload i odrzucenia; `npm run lint` i `npm test` przechodzą

## Poza zakresem
* Przycinanie / skalowanie obrazów
* Zewnętrzne magazyny plików (np. S3), o ile research nie wykaże inaczej
* Frontend

## Pytania do researchu
* Gdzie przechowywać plik: dysk lokalny, baza, magazyn zewnętrzny?
* Jak reprezentować avatar w bazie (pole w `Profile` czy `User`) i jak go serwować?
* Kto może wgrywać: tylko właściciel konta, czy też administrator dla innych użytkowników?
* Dozwolone formaty i limit rozmiaru?
* Czy zastąpienie avatara usuwa stary plik? Czy potrzebne jest usuwanie avatara?
* Jak testować upload w testach HTTP z atrapą Prismy (multer)?
