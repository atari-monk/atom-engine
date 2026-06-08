## Input

### Purpose

Klasa `Input` jest wysokopoziomowym wrapperem nad niskopoziomowym systemem wejścia. Zarządza śledzeniem stanu klawiatury, w tym naciśnięciami klawiszy oraz stanami przytrzymania, jednocześnie opcjonalnie filtrując „zablokowane” klawisze (np. klawisze strzałek, spację oraz określone klawisze akcji). Udostępnia uproszczone API do zapytań o stan wejścia w pętlach gry lub aplikacjach interaktywnych.

---

### Lifecycle

Creation → Update → Destruction

* **Creation**

  * `InputState` jest tworzony za pomocą `createInputState(blockedKeys)`.
  * Globalne lub zdarzeniowe listenery są podpinane za pomocą `attachInput`.
  * Instancja zaczyna natychmiast śledzić wejście z klawiatury.

* **Update**

  * Wewnętrzny `InputState` jest aktualizowany pośrednio przez listenery zdarzeń.
  * Konsumenci odczytują stan przez `isDown` i `isPressed`.
  * Przejścia stanu pressed są zazwyczaj oparte o klatki i muszą być czyszczone ręcznie.

* **Destruction**

  * W tej klasie nie zaimplementowano jawnego teardown.
  * Jeśli jest potrzebne, czyszczenie musi być obsłużone zewnętrznie w bazowym systemie wejścia.

---

### Public API

#### `constructor(blockedKeys?: string[])`

Tworzy nową instancję handlera wejścia.

* **Parameters**

  * `blockedKeys` (opcjonalne): Tablica identyfikatorów klawiszy ignorowanych w przetwarzaniu wejścia.

    * Domyślnie: `["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "e"]`

---

#### `isDown(key: string): boolean`

Sprawdza, czy klawisz jest obecnie wciśnięty.

* **Returns**

  * `true` jeśli klawisz jest aktualnie wciśnięty
  * `false` w przeciwnym razie

---

#### `isPressed(key: string): boolean`

Sprawdza, czy klawisz został naciśnięty w bieżącym cyklu aktualizacji.

* **Returns**

  * `true` jeśli klawisz przeszedł ze stanu up → down w bieżącej klatce
  * `false` w przeciwnym razie

---

#### `clearPressed(): void`

Resetuje wszystkie stany „pressed”.

* Zazwyczaj wywoływane raz na klatkę po przetworzeniu wejścia.

---

#### `getState(): InputState`

Zwraca bazowy obiekt stanu wejścia.

* **Returns**

  * Wewnętrzna instancja `InputState` używana do śledzenia wejścia

---

### Internal Behavior

* Klasa zależy od zewnętrznego modułu wejścia (`../input`), który dostarcza:

  * typ `InputState`
  * `createInputState(blockedKeys)` do inicjalizacji
  * `attachInput(state)` do rejestrowania listenerów zdarzeń
  * `isKeyDown(state, key)` do ciągłego sprawdzania wejścia
  * `isKeyPressed(state, key)` do wykrywania wejścia krawędziowego
  * `clearPressed(state)` do resetowania flag naciśnięć per klatka

* `blockedKeys` są przekazywane przy inicjalizacji i używane przez system bazowy do filtrowania niechcianych lub zarezerwowanych wejść.

* Klasa sama nie nasłuchuje bezpośrednio zdarzeń; deleguje całe śledzenie wejścia do współdzielonego `InputState`.

* Pełni rolę cienkiej warstwy abstrakcji upraszczającej użycie w pętlach gry lub systemach UI.

---

### Example

```ts
import { Input } from "./Input";

const input = new Input();

// Game loop
function update() {
    if (input.isDown("ArrowLeft")) {
        console.log("Moving left continuously");
    }

    if (input.isPressed(" ")) {
        console.log("Jump triggered");
    }

    // Reset per-frame press states
    input.clearPressed();
}
```

---

### Related Elements

* `InputState` – Wewnętrzna struktura przechowująca stany klawiszy
* `createInputState` – Inicjalizuje stan śledzenia wejścia
* `attachInput` – Podpina listenery zdarzeń klawiatury
* `isKeyDown` – Sprawdza ciągły stan klawisza
* `isKeyPressed` – Sprawdza stan krawędziowy klawisza
* `clearPressed` – Resetuje flagi naciśnięć klawiszy per klatka