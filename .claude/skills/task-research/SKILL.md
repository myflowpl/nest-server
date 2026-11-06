---
name: task-research
description: Krok 2 workflow zadań. Użyj po wytycznych, gdy użytkownik wywoła /task-research <slug> albo powie "zrób research" dla zadania z katalogu tasks/. Czyta kod i wytyczne (tylko odczyt), pisze 2-research.md z opcjami i decyzjami do podjęcia.
---

# task-research: opcje i decyzje

Argument: slug zadania (katalog w `tasks/`). Jeśli brak, zapytaj lub wylistuj katalogi w `tasks/`.

## Kroki

1. Przeczytaj `tasks/<slug>/1-wytyczne.md` i `AGENTS.md`.
2. Przeanalizuj kod: pliki wzorcowe, miejsca, które zmiana dotknie, istniejące testy, schemat Prismy, jeśli dotyczy. Źródła: kod, git i dokumentacja w repo. W sieci szukaj tylko na wyraźną prośbę użytkownika.
3. Nie edytuj niczego poza `tasks/<slug>/2-research.md`. Nie uruchamiaj skryptów zapisujących do bazy (`db:playground`, `db:race`, `db:reset`).
4. Zapisz `2-research.md` według szablonu. Każdą rzecz, której wytyczne nie rozstrzygają (formaty, kolejność, kody błędów, uprawnienia, zachowanie na brzegach), zamień na decyzję. Nie rozstrzygaj za użytkownika po cichu.
5. Decyzje podaj **bezpośrednio w odpowiedzi** i zapisz w pliku w tym samym formacie (numer i tytuł, 1-2 zdania opisu, opcje A/B/C max D z jednozdaniową konsekwencją, rekomendacja oznaczona **(rekomendacja)** i pierwsza). Zakończ zdaniem: „Odpowiedz np. `1A, 2B, 3A`; brak odpowiedzi = moja rekomendacja”.
6. Gdy użytkownik odpowie, uzupełnij w pliku sekcję „Odpowiedzi” (numer → wybrana opcja) i ustaw `Status: research gotowy`.

## Szablon `2-research.md`

```markdown
# Research: <Nazwa zadania>

Status: do decyzji

## Co sprawdziłem
* Fakty z kodu z linkami do plików (`src/...:linia`)

## Ryzyka
* Co może się nie udać i skąd to wiem

## Decyzje
### 1. Tytuł
Opis.
* A. **(rekomendacja)** ...
* B. ...

## Odpowiedzi
(uzupełniane po odpowiedzi użytkownika)
```
