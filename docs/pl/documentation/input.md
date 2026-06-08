## System stanu wejścia

### Cel

Ten moduł zapewnia lekki system śledzenia wejścia z klawiatury dla aplikacji webowych (zwykle gier lub interaktywnych symulacji). Utrzymuje stan w czasie rzeczywistym dla aktualnie przytrzymywanych klawiszy, nowo naciśniętych klawiszy (na klatkę) oraz opcjonalnie blokuje domyślne zachowanie przeglądarki dla określonych klawiszy.

Został zaprojektowany, aby wspierać zarówno wejście ciągłe (np. ruch podczas przytrzymania klawisza), jak i zdarzenia wejścia dyskretnego (np. pojedyncze akcje naciśnięcia).

---

### Cykl życia

Tworzenie → Aktualizacja → Zniszczenie

**Tworzenie**
- `createInputState()` inicjalizuje obiekt stanu wejścia z pustymi zbiorami śledzenia oraz opcjonalnymi zablokowanymi klawiszami.

**Aktualizacja**
- `attachInput()` rejestruje globalne listenery `keydown` i `keyup` na `window`.
- Stan jest ciągle aktualizowany w miarę interakcji użytkownika z klawiaturą.

**Utrzymanie per klatkę**
- `clearPressed()` jest zazwyczaj wywoływane raz na cykl aktualizacji/klatki, aby zresetować stan „właśnie naciśnięte”.

**Zniszczenie**
- Ten moduł nie zapewnia funkcji czyszczenia listenerów zdarzeń; ich usunięcie musi być obsłużone zewnętrznie, jeśli jest potrzebne.

---

### Publiczne API

#### `InputState`

```ts
type InputState = {
    keys: Set<string>;
    pressed: Set<string>;
    blockedKeys: Set<string>;
};
```

* `keys`: Wszystkie aktualnie przytrzymywane klawisze.
* `pressed`: Klawisze, które zostały naciśnięte jednorazowo (bez powtórzeń) od ostatniego resetu.
* `blockedKeys`: Klawisze, których domyślne zachowanie przeglądarki powinno być blokowane.

---

#### `createInputState(blockedKeys?: string[]): InputState`

Tworzy i zwraca nowy obiekt stanu wejścia.

* `blockedKeys` (opcjonalne): Lista wartości klawiszy, których domyślne zachowanie przeglądarki powinno być blokowane.
* Domyślnie blokowane klawisze:

  * Klawisze strzałek (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`)
  * Spacja (`" "`)
  * `"e"`

---

#### `attachInput(state: InputState): void`

Rejestruje globalne listenery zdarzeń klawiatury i aktualizuje przekazany stan:

* Przy `keydown`:

  * Dodaje klawisz do `keys`
  * Dodaje klawisz do `pressed` tylko jeśli nie jest to zdarzenie auto-powtarzane
  * Zapobiega domyślnemu zachowaniu, jeśli klawisz znajduje się w `blockedKeys`

* Przy `keyup`:

  * Usuwa klawisz z `keys`
  * Zapobiega domyślnemu zachowaniu, jeśli klawisz znajduje się w `blockedKeys`

---

#### `clearPressed(state: InputState): void`

Czyści zbiór `pressed`.

* Zazwyczaj wywoływane raz na klatkę/cykl w pętli gry.
* Zapewnia, że `pressed` odzwierciedla tylko klawisze wywołane od ostatniego cyklu aktualizacji.

---

#### `isKeyDown(state: InputState, key: string): boolean`

Zwraca, czy klawisz jest aktualnie wciśnięty.

* Sprawdza obecność w `state.keys`.

---

#### `isKeyPressed(state: InputState, key: string): boolean`

Zwraca, czy klawisz został naciśnięty jednorazowo od ostatniego wywołania `clearPressed()`.

* Sprawdza obecność w `state.pressed`.

---

### Wewnętrzne działanie

#### Model śledzenia klawiszy

System rozróżnia:

* **Stan ciągły (`keys`)**

  * Aktualizowany zarówno przy `keydown`, jak i `keyup`
  * Odzwierciedla klawisze aktualnie przytrzymywane w czasie rzeczywistym

* **Stan wyzwalany zboczem (`pressed`)**

  * Aktualizowany tylko przy początkowych zdarzeniach `keydown` (`e.repeat === false`)
  * Przeznaczony do jednorazowych akcji (np. skok, strzał, potwierdzenie wejścia)

#### Obsługa zdarzeń

* Używa globalnego `window.addEventListener` dla zdarzeń klawiatury.
* Polega na wartościach `KeyboardEvent.key` przeglądarki.
* Zapobiega domyślnemu zachowaniu przeglądarki dla klawiszy w `blockedKeys`, co jest przydatne do:

  * Zapobiegania przewijaniu strony (strzałki, spacja)
  * Zapobiegania przypadkowej nawigacji lub konfliktom wejścia

#### Ograniczenia

* Brak wbudowanego mechanizmu czyszczenia/usuwania listenerów zdarzeń.
* Używa globalnych listenerów zdarzeń (nie jest scoped do komponentu lub elementu).
* Brak wsparcia dla mapowania klawiszy poza `blockedKeys`.

---

### Przykład

```ts
const input = createInputState();

// Attach global listeners
attachInput(input);

// Game loop
function update() {
    if (isKeyDown(input, "ArrowRight")) {
        console.log("Moving right continuously");
    }

    if (isKeyPressed(input, " ")) {
        console.log("Jump triggered once");
    }

    // Reset per-frame pressed state
    clearPressed(input);

    requestAnimationFrame(update);
}

update();
```

---

### Powiązane elementy

* `KeyboardEvent` (Web API)
* Game loop / systemy aktualizacji klatek
* Systemy buforowania wejścia w silnikach gier
* Wzorce zarządzania stanem dla interakcji w czasie rzeczywistym