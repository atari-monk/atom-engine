## Pętla gry o stałym kroku czasowym

### Cel

Ten moduł implementuje pętlę gry o stałym kroku czasowym z użyciem `requestAnimationFrame`, z obsługą:
- Deterministycznych aktualizacji poprzez stały `delta time`
- Akumulacji nadmiarowego czasu klatki
- Interpolowanego renderowania z użyciem wartości `alpha`

Jest często używany w grach i symulacjach, gdzie wymagane są stabilne aktualizacje fizyki niezależnie od wahań liczby klatek.

---

### Cykl życia

Creation → Start → Update/Render Loop → Stop

1. **Creation**: Stan pętli jest tworzony za pomocą `createLoop`
2. **Start**: Pętla jest uruchamiana za pomocą `startLoop`
3. **Update/Render Loop**: Powtarzane wywołania `tick` zarządzają fazami aktualizacji i renderowania
4. **Stop**: Pętla jest zatrzymywana za pomocą `stopLoop`

---

### Publiczne API

#### `LoopState`

Reprezentuje wewnętrzny stan pętli.

- `lastTime: number`  
  Znacznik czasu ostatniej klatki (w milisekundach)

- `accumulator: number`  
  Czas skumulowany jeszcze nieprzetworzony przez stałe aktualizacje

- `fixedDelta: number`  
  Stały krok czasowy w sekundach (domyślnie: 1/60)

- `update(dt: number): void`  
  Funkcja wywoływana w stałych odstępach z dt = fixedDelta

- `render(alpha: number): void`  
  Funkcja renderująca wywoływana raz na klatkę z czynnikiem interpolacji

- `running: boolean`  
  Czy pętla jest aktualnie aktywna

- `frameId: number | null`  
  Bieżące ID `requestAnimationFrame`

---

#### `createLoop(update, render, fixedDelta?)`

Tworzy i zwraca nowy stan pętli.

**Parametry**
- `update(dt: number)` – funkcja aktualizacji w stałym kroku
- `render(alpha: number)` – funkcja renderowania z interpolacją
- `fixedDelta?: number` – krok czasowy w sekundach (domyślnie: 1/60)

**Zwraca**
- `LoopState`

---

#### `startLoop(state)`

Uruchamia pętlę animacji, jeśli nie jest już aktywna.

**Zachowanie**
- Ustawia `running = true`
- Planowanie pierwszego wywołania `requestAnimationFrame`
- Zapobiega wielokrotnemu uruchomieniu

---

#### `stopLoop(state)`

Zatrzymuje pętlę i anuluje oczekujące klatki animacji.

**Zachowanie**
- Ustawia `running = false`
- Anuluje zaplanowaną klatkę przez `cancelAnimationFrame`
- Czyści `frameId`

---

### Wewnętrzne działanie

#### `tick(state, time)`

Główna funkcja pętli wykonywana przy każdej klatce animacji.

##### Kroki:

1. **Warunek ochronny**
   - Natychmiast kończy działanie, jeśli `state.running` jest false

2. **Inicjalizacja czasu**
   - Przy pierwszej klatce ustawia `lastTime = time`

3. **Obliczanie delty**
   - Oblicza czas, który upłynął w sekundach:
     ```
     delta = (time - lastTime) / 1000
     ```
   - Ogranicza delta do maksymalnie `0.25s`, aby uniknąć efektu spiral of death przy spadkach wydajności

4. **Akumulacja czasu**
   - Dodaje delta do `state.accumulator`

5. **Stałe aktualizacje**
   - Wywołuje `state.update(fixedDelta)` tyle razy, ile potrzeba:
     ```
     while (accumulator >= fixedDelta)
     ```
   - Zapewnia deterministyczne kroki symulacji

6. **Czynnik interpolacji**
   - Oblicza:
     ```
     alpha = accumulator / fixedDelta
     ```
   - Używany do płynnego renderowania między krokami symulacji

7. **Wywołanie renderowania**
   - Wywołuje `state.render(alpha)`

8. **Kontynuacja pętli**
   - Planowanie następnej klatki przez `requestAnimationFrame`

---

### Przykład

```ts
const loop = createLoop(
    (dt) => {
        // aktualizacja fizyki / logiki gry
        position += velocity * dt;
    },
    (alpha) => {
        // interpolacja dla płynnego renderowania
        renderSprite(position + velocity * alpha);
    }
);

startLoop(loop);

// później...
stopLoop(loop);
```

---

### Powiązane elementy

* `requestAnimationFrame` — API przeglądarki używane do planowania klatek
* Fixed timestep game loop — wzorzec symulacji używany w silnikach fizyki
* Interpolation rendering — technika wygładzania wizualnych aktualizacji między krokami symulacji