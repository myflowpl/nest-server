# nest-server: reguły dla agentów AI

Panel administracyjny użytkowników: NestJS 12 (ESM), Prisma 7 + PostgreSQL, JWT z rolami, Vitest. Nazwy w kodzie po angielsku, komentarze i komunikaty dla użytkownika po polsku.

## Zasady pracy

Wytyczne ograniczające typowe błędy LLM przy kodowaniu (źródło: multica-ai/andrej-karpathy-skills, `CLAUDE.md`). Przedkładają ostrożność nad szybkość; przy trywialnych zadaniach kieruj się rozsądkiem.

### 1. Najpierw myśl, potem koduj

Nie zakładaj, nie ukrywaj wątpliwości, pokazuj kompromisy. Przed implementacją:
* Jawnie podaj założenia; jeśli czegoś nie jesteś pewien, zapytaj.
* Gdy istnieje kilka interpretacji, przedstaw je, zamiast po cichu wybierać jedną.
* Jeśli istnieje prostsze podejście, powiedz o tym i sprzeciw się, gdy to uzasadnione.
* Jeśli coś jest niejasne, zatrzymaj się, nazwij, co jest niejasne, i zapytaj.

### 2. Najpierw prostota

Minimum kodu, które rozwiązuje problem. Nic spekulatywnego.
* Żadnych funkcji ponad to, o co poproszono.
* Żadnych abstrakcji dla kodu użytego raz.
* Żadnej „elastyczności” ani konfigurowalności, której nikt nie chciał.
* Żadnej obsługi błędów dla scenariuszy niemożliwych.
* Jeśli napisałeś 200 linii, a da się w 50, przepisz.

Zapytaj siebie: „Czy starszy inżynier uznałby to za przekombinowane?”. Jeśli tak, uprość.

### 3. Chirurgiczne zmiany

Dotykaj tylko tego, co musisz. Sprzątaj tylko po sobie.
* Nie „ulepszaj” sąsiedniego kodu, komentarzy ani formatowania.
* Nie refaktoryzuj rzeczy, które nie są zepsute.
* Dopasuj się do istniejącego stylu, nawet jeśli zrobiłbyś inaczej.
* Zauważony niezwiązany martwy kod zgłoś, nie usuwaj.
* Usuń importy, zmienne i funkcje, które osierociła TWOJA zmiana; istniejącego martwego kodu nie usuwaj bez prośby.

Test: każda zmieniona linia musi dać się wprost wyprowadzić z prośby użytkownika.

### 4. Wykonanie sterowane celem

Określ kryteria sukcesu i powtarzaj do skutku, aż zostaną potwierdzone.
* „Dodaj walidację” → „napisz testy dla błędnych danych, potem spraw, by przechodziły”
* „Napraw błąd” → „napisz test, który go odtwarza, potem spraw, by przechodził”
* „Zrefaktoryzuj X” → „upewnij się, że testy przechodzą przed i po”

Przy zadaniach wieloetapowych podaj krótki plan:
```
1. [Krok] → weryfikacja: [sprawdzenie]
2. [Krok] → weryfikacja: [sprawdzenie]
```

Mocne kryteria sukcesu pozwalają pracować samodzielnie; słabe („niech działa”) wymagają ciągłych dopytywań.

Wytyczne działają, jeśli: w diffach jest mniej zbędnych zmian, mniej przepisywania z powodu nadmiernej komplikacji, a pytania doprecyzowujące padają przed implementacją, nie po błędach.

## Komendy

* `npm run db:up` - baza w Dockerze; musi działać przed `test:e2e`, `db:migrate`, `db:seed` i skryptami `db:*`
* `npm run start:dev` - serwer z przeładowaniem (port z `.env`), Swagger pod `/docs`
* `npm run build` - kompilacja (`nest build`); `npm run format` - prettier dla `src/` i `test/`
* `npm run lint` - oxlint, musi przejść przed zakończeniem pracy
* `npm test` - testy jednostkowe i HTTP (bez bazy); `npm run test:e2e` - testy z bazą `<nazwa>_test`
* `npm run db:migrate` - nowa migracja po zmianie `prisma/schema.prisma` (generuje też klienta); samo `npm run db:generate` odtwarza klienta w `src/generated/`
* `npm run db:seed` - dane startowe; `npm run db:studio` - podgląd bazy

## Konwencje

* ESM: importy względne zawsze z rozszerzeniem `.js` (`from './users.service.js'`), także dla plików `.ts`
* Do API nigdy nie zwracamy rekordu Prismy, tylko widok (np. `toUserView`), bo rekord zawiera `passwordHash`
* Endpointy administratora: `@ApiAuth(RoleNames.ADMIN)`; trasy stałe (np. `GET export`) deklaruj przed `@Get(':id')`, inaczej nazwa trasy zostanie potraktowana jak id
* Struktura: moduły w `src/` (`auth`, `users`, `stats`), `src/prisma` to `PrismaService`
* Testy: Vitest, funkcje `describe/it/expect` są globalne, atrapy to `vi.fn()` (nie `jest`); test jednostkowy leży obok pliku jako `*.spec.ts`, testy HTTP w `test/http`, testy z bazą w `test/e2e`
* Testy HTTP: `createTestApp(prisma)` z `test/support/app.ts` buduje prawdziwą aplikację z atrapą Prismy (obiekt z `vi.fn()` per metoda); token do żądań daje `app.get(AuthService).signToken(id)`; wzór: `test/http/admin-users.spec.ts`

## Granice

* Nie edytuj `src/generated/` ani istniejących migracji w `prisma/migrations/`
* Nie uruchamiaj `npm run db:reset` ani `prisma migrate reset` (kasują dane)
* Skryptów `db:playground` i `db:race` nie uruchamiaj bez prośby: zapisują do bazy deweloperskiej (tworzą użytkowników, `db:race` chwilowo zmienia role administratorów)
* Nie czytaj i nie wypisuj `.env`; sekretów nie wpisuj do kodu ani do tego pliku
* Nie dodawaj zależności do `package.json` bez wyraźnej prośby
* Nie commituj i nie wypychaj zmian, jeśli nie zostałeś o to poproszony

## Zanim napiszesz, że gotowe

Uruchom `npm run lint` i `npm test` i pokaż ich wynik. Jeśli zmieniałeś kod zależny od bazy, uruchom też `npm run test:e2e`.
