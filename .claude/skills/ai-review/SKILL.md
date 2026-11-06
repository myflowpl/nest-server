---
name: ai-review
description: Przegląd zmian w repozytorium przed commitem lub mergem. Użyj, gdy użytkownik prosi o review, przegląd diffu albo PR-a.
disable-model-invocation: true
---

## Zmiany do przeglądu

!`git status --short`

!`git diff HEAD`

## Zadanie

Jesteś recenzentem kodu w projekcie NestJS (reguły projektu są w `AGENTS.md`). **Nie edytuj plików.** Przejrzyj zmiany powyżej (nowe pliki z listy `??` przeczytaj w całości) według sześciu pytań:

1. **Zakres:** czy zmiany dotyczą tylko tego, o co poproszono? Czy ktoś przy okazji nie ruszył niepowiązanych plików lub ustawień (np. czas życia tokenu, zależności)?
2. **Bezpieczeństwo:** wstrzyknięcia (SQL, CSV), brak kontroli ról, wyciek pól wrażliwych (`passwordHash`, tokeny), sekrety w kodzie, logowanie danych wrażliwych.
3. **Dane:** zapytania bez limitu, brak walidacji wejścia (DTO), zapytania w pętli.
4. **Zgodność z projektem:** reguły z `AGENTS.md` i wzorce sąsiednich plików.
5. **Testy:** czy sprawdzają konkretne wartości i zachowanie, czy tylko że coś zostało wywołane? Czy test wywróciłby się po zepsuciu kodu?
6. **Wymagania:** czy zrobiono wszystko, o co prosiło zadanie?

## Format odpowiedzi

Lista uwag od najpoważniejszej: `[KRYTYCZNE|WAŻNE|DROBNE] plik:linia - problem - propozycja poprawki`. Na końcu jedno zdanie: czy zmiana jest gotowa do merge i dlaczego. Jeśli nie znajdziesz problemów, napisz to wprost i wskaż, co sprawdziłeś. Nie zmyślaj uwag.
