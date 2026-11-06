---
name: task-spec
description: Krok 3 workflow zadań. Użyj po researchu, gdy użytkownik wywoła /task-spec <slug> albo poprosi o specyfikację zadania. Na podstawie wytycznych, researchu i odpowiedzi pisze 3-specyfikacja.md, czyli kontrakt do implementacji.
---

# task-spec: kontrakt do implementacji

Argument: slug zadania.

## Kroki

1. Przeczytaj `1-wytyczne.md`, `2-research.md` i `AGENTS.md` z `tasks/<slug>/`.
2. Jeśli w `2-research.md` są decyzje bez wpisu w „Odpowiedzi”, **zatrzymaj się**: wypisz je i zapytaj. Brak odpowiedzi użytkownika = jego jawna zgoda na rekomendacje tylko wtedy, gdy tak napisał w tej rozmowie.
3. Napisz `tasks/<slug>/3-specyfikacja.md` według szablonu. Wymagania numeruj R1…Rn; każde ma dać się sprawdzić jednym testem lub komendą i ma mieć wpisany sposób sprawdzenia.
4. Zapisz tylko to, czego nie ma w `AGENTS.md`. Nie powtarzaj „nie commituj”, „bez nowych bibliotek”, „lint i test przechodzą”. W Granicach podaj tylko to, co specyficzne dla zadania (np. „tylko `src/users/` i `test/`”).
5. W „Danych do weryfikacji” sprawdź w `prisma/seed.ts` i bazie (przez kod, bez czytania `.env`), jakie konta i dane nadają się do ręcznego testu, i zaznacz pułapki (np. zablokowane konta z seeda). Hasła z seeda mogą tu być, bo są w repo.
6. Ustaw `Status: specyfikacja`. Pokaż użytkownikowi ścieżkę i listę R1…Rn, poproś o zatwierdzenie. Następny krok: `/task-implement <slug>`.

Nie edytuj niczego poza `tasks/<slug>/3-specyfikacja.md`.

## Szablon `3-specyfikacja.md`

```markdown
# <Nazwa zadania>

Status: specyfikacja

## Cel
## Kontekst
* Pliki wzorcowe, odwołanie do `2-research.md`

## Decyzje
* Skrót podjętych decyzji (numer z researchu → ustalenie)

## Wymagania
* R1. ... → sprawdzenie: ...
* R2. ...

## Poza zakresem
## Granice
* Tylko zmiany specyficzne dla zadania

## Dane do weryfikacji
* Konta, port, przygotowanie bazy, pułapki

## Weryfikacja
* Ponad `npm run lint` i `npm test`: ręczne sprawdzenia, `check:*`

## Raport
Zapisz w `4-raport.md` (patrz `/task-implement`).
```
