---
name: task-implement
description: Krok 4 workflow zadań. Użyj, gdy użytkownik mówi "zrealizuj/zaimplementuj tasks/<slug>" albo wywoła /task-implement <slug>. Realizuje 3-specyfikacja.md lokalnie, commituje lokalnie, prowadzi 4-raport.md. Push i deploy tylko po wyraźnym poleceniu użytkownika.
---

# task-implement: realizacja specyfikacji

Argument: slug zadania. Podstawą jest `tasks/<slug>/3-specyfikacja.md`; bez niej zatrzymaj się i wskaż `/task-spec`.

## Kroki

1. Przeczytaj specyfikację i `AGENTS.md`. Podaj krótki plan: kroki i weryfikacja każdego (zgodnie z AGENTS.md pkt 4). Założenia i rozbieżności ze specyfikacją nazwij od razu.
2. Test najpierw tam, gdzie się da, potem kod. Dotykaj tylko plików wynikających ze specyfikacji i jej Granic.
3. **Commity lokalne**: commituj sam, często (po każdym spójnym kroku, np. testy czerwone → zielone, osobny commit na refaktor), żeby zawsze dało się cofnąć. Wiadomości po polsku, krótkie, w stylu historii repo (`git log --oneline`), zakończone linią atrybucji z system-reminder, jeśli jest. Bez `--amend` na commitach już wskazanych użytkownikowi, bez `--no-verify`, bez `git reset --hard`/`push --force`. Nie commituj plików spoza zadania (sprawdź `git status`; dodawaj pliki po nazwach, nie `git add -A`).
4. W trakcie prowadź `tasks/<slug>/4-raport.md`: dopisuj problemy i odkrycia na bieżąco, nie dopiero na końcu.
5. Przed „gotowe” uruchom `npm run lint` i `npm test` (oraz `test:e2e`, jeśli zmiana zależy od bazy) i pokaż wynik. Wykonaj ręczne sprawdzenia ze specyfikacji. Czego nie dało się sprawdzić, napisz wprost.
6. Zakończ raportem w odpowiedzi (skrót `4-raport.md`) i wskaż użytkownikowi, że zmiany są **tylko lokalne**.

## Push i deploy: tylko na wyraźne polecenie

* Domyślnie wszystko zostaje lokalnie. Nie wykonuj `git push`, tworzenia PR, ani żadnego deployu z własnej inicjatywy ani na podstawie zgody z innego zadania.
* Wykonaj je dopiero, gdy użytkownik w tej rozmowie jasno napisze, co ma się stać (np. „wypchnij”, „wdróż”). „Ok”, „dobrze” czy zatwierdzenie planu to nie jest takie polecenie. Przy wątpliwości zapytaj jednym zdaniem.
* Push: `git push origin <aktualna gałąź>`; zwykły, bez force. Remote to `origin` (GitHub `myflowpl/nest-server`). Przed pushem pokaż `git log origin/<gałąź>..HEAD --oneline`.
* **Deploy: w repo nie ma opisanej procedury** (brak w README, `package.json`, `AGENTS.md`). Zanim cokolwiek zrobisz, poproś użytkownika o komendy i kroki (gdzie, jak, jak sprawdzić, że działa, jak cofnąć), a po ich podaniu dopisz je tutaj, w tej sekcji, żeby kolejne zadania miały je gotowe.

## Szablon `4-raport.md`

```markdown
# Raport: <Nazwa zadania>

Status: lokalnie | wypchnięte | wdrożone

## Zmienione pliki
## Wyniki komend
* lint, test, (e2e), ręczne sprawdzenia: wynik

## Wymagania
| Wymaganie | Stan | Jak sprawdzone |
|---|---|---|
| R1 ... | spełnione / niespełnione / niesprawdzone | ... |

## Commity
* hash i tytuł każdego commita zadania

## Problemy i odkrycia
* Co poszło inaczej niż w specyfikacji, czego się dowiedzieliśmy o kodzie lub bazie, co warto wiedzieć przy kolejnych poprawkach (z linkami do plików)

## Niepewności i do zgłoszenia
* Rzeczy, w czym nie byłem pewien; zauważony niezwiązany martwy kod (zgłaszamy, nie usuwamy)
```
