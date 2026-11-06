---
name: task-brief
description: Krok 1 workflow zadań. Użyj, gdy użytkownik zaczyna nowe zadanie ("nowe zadanie: <nazwa>" + opis) albo wywoła /task-brief. Zakłada katalog tasks/<slug>/ i pisze 1-wytyczne.md. Nie czyta kodu głębiej niż trzeba do wskazania wzorców i niczego nie implementuje.
---

# task-brief: wytyczne nowego zadania

Workflow: `1-wytyczne.md` → `2-research.md` → `3-specyfikacja.md` → implementacja (`4-raport.md`). Skille: `task-brief`, `task-research`, `task-spec`, `task-implement`.

## Kroki

1. Z nazwy zadania zrób slug: angielski lub polski bez polskich znaków, małe litery, myślniki (`Blokowanie użytkowników` → `blokowanie-uzytkownikow`). Jeśli `tasks/<slug>/` już istnieje, zatrzymaj się i zapytaj, czy kontynuować, czy nazwać inaczej.
2. Znajdź w kodzie 1-3 pliki wzorcowe (podobny endpoint, serwis, test), tylko żeby wpisać je do Kontekstu. Nie analizuj głębiej, to zadanie researchu.
3. Utwórz `tasks/<slug>/1-wytyczne.md` według szablonu poniżej. Treść po polsku, krótko; opis użytkownika przepisz wiernie, nie dopowiadaj wymagań.
4. Jeśli opis jest niejasny, zadaj pytania w formacie z `~/.claude/CLAUDE.md` (numer i tytuł, opis, opcje A/B/C, rekomendacja pierwsza, bezpośrednio w odpowiedzi). Pytania zapisz też w sekcji „Pytania do researchu”.
5. Zakończ: ścieżka pliku, 2-3 zdania streszczenia, następny krok (`/task-research <slug>`).

Nie edytuj niczego poza `tasks/<slug>/`.

## Szablon `1-wytyczne.md`

```markdown
# <Nazwa zadania>

Status: wytyczne

## Cel
Jedno-dwa zdania: co ma być możliwe po zadaniu, z dokładnym endpointem / ekranem / komendą, jeśli jest znany.

## Kontekst
* Pliki wzorcowe (ścieżka + po co)
* Powiązane reguły z `AGENTS.md`, jeśli są istotne

## Wstępne wymagania
* Zdania, które da się sprawdzić testem lub komendą (jeszcze bez numeracji)

## Poza zakresem
* Co świadomie pomijamy

## Pytania do researchu
* Czego nie wiemy i co trzeba sprawdzić w kodzie
```
