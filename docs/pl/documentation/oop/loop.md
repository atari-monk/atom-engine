## GameLoop

### Purpose

`GameLoop` jest wysokopoziomowym wrapperem nad niskopoziomowym systemem pętli. Enkapsuluje tworzenie i zarządzanie pętlą gry, która wielokrotnie wykonuje funkcje update i render w stałym kroku czasowym. Upraszcza uruchamianie, zatrzymywanie i sprawdzanie stanu pętli.

### Lifecycle
Utworzenie → Aktualizacja → Destrukcja

- **Creation**: Instancja `GameLoop` jest tworzona z callbackami `update` i `render`. Wewnętrznie inicjalizuje stan pętli poprzez `createLoop`.
- **Update**: Po uruchomieniu pętla wielokrotnie wywołuje dostarczone funkcje `update(dt)` oraz `render(alpha)` zgodnie z implementacją bazowej pętli.
- **Destruction**: Pętla może zostać zatrzymana poprzez `stop()`, co zatrzymuje jej wykonanie. Sama instancja nie zwalnia jawnie zasobów poza zatrzymaniem pętli.

### Public API

- **constructor(update, render, fixedDelta?)**
  - `update(dt: number)`: Funkcja wywoływana przy każdym ticku z czasem delta.
  - `render(alpha: number)`: Funkcja wywoływana do interpolacji renderowania.
  - `fixedDelta?: number`: Stały interwał kroku czasowego (domyślnie: 1/60).

- **start(): void**
  - Uruchamia wewnętrzne wykonanie pętli.

- **stop(): void**
  - Zatrzymuje wewnętrzne wykonanie pętli.

- **isRunning(): boolean**
  - Zwraca, czy pętla jest aktualnie aktywna.

### Internal Behavior

- Utrzymuje wewnętrzny obiekt `LoopState` utworzony przez `createLoop(update, render, fixedDelta)`.
- Deleguje kontrolę wykonania do zewnętrznych narzędzi pętli:
  - `startLoop(state)` rozpoczyna pętlę.
  - `stopLoop(state)` zatrzymuje pętlę.
- Flaga `state.running` jest używana do określenia, czy pętla jest aktywna.
- Klasa sama nie implementuje logiki czasu; działa jako cienka warstwa orkiestracji nad systemem pętli.

### Example

```ts
const loop = new GameLoop(
  (dt) => {
    // update game logic
    console.log("update", dt);
  },
  (alpha) => {
    // render frame
    console.log("render", alpha);
  }
);

loop.start();

setTimeout(() => {
  console.log(loop.isRunning()); // true
  loop.stop();
}, 2000);
```

### Related Elements

* `LoopState`
* `createLoop`
* `startLoop`
* `stopLoop`