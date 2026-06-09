## Moduł Narzędzi Renderowania

### Cel

Zapewnia lekką abstrakcję renderowania na canvasie dla elementów HTML5 `<canvas>`. Moduł:

* Tworzy i zarządza stanem renderowania (`RenderState`)
* Obsługuje automatyczną zmianę rozmiaru canvasa oraz skalowanie dla wysokiego DPI (Retina)
* Udostępnia funkcje pomocnicze do czyszczenia canvasa
* Zapewnia podstawowe prymitywy rysowania:

  * Okręgi
  * Prostokąty
  * Linie
  * Tekst

Ten moduł ma na celu uproszczenie typowych operacji konfiguracji i renderowania 2D na canvasie.

### Cykl życia

**Tworzenie → Aktualizacja → Zniszczenie**

#### Tworzenie

1. Wywołaj `createRenderState(canvasId)`.
2. Docelowy element canvas jest lokalizowany w DOM.
3. Pobierany jest kontekst renderowania 2D.
4. Rozmiar canvasa jest dostosowywany do rozmiaru okna przeglądarki.
5. Rejestrowany jest nasłuchiwacz zmiany rozmiaru okna.

#### Aktualizacja

1. Funkcje renderujące (`drawCircle`, `drawRect`, `drawLine`, `drawText`) są wywoływane w każdej klatce lub zawsze wtedy, gdy potrzebne są aktualizacje wizualne.
2. `clear()` może zostać użyte do wyzerowania canvasa przed ponownym rysowaniem.
3. Gdy okno przeglądarki zmienia rozmiar, `resize()` jest wywoływane automatycznie.

#### Zniszczenie

Ten moduł nie zapewnia jawnej funkcjonalności czyszczenia.

Zarejestrowany nasłuchiwacz zdarzenia zmiany rozmiaru pozostaje aktywny przez cały czas życia strony. Jeśli wymagane jest zachowanie związane ze zwalnianiem zasobów, należy zaimplementować dodatkową logikę usuwającą nasłuchiwacz.

### Publiczne API

#### `interface RenderState`

Reprezentuje środowisko renderowania.

| Właściwość | Typ                        | Opis                                   |
| ---------- | -------------------------- | -------------------------------------- |
| `canvas`   | `HTMLCanvasElement`        | Docelowy element canvas.               |
| `ctx`      | `CanvasRenderingContext2D` | Kontekst renderowania 2D używany do rysowania. |

---

#### `createRenderState(canvasId: string): RenderState`

Tworzy i inicjalizuje stan renderowania.

##### Parametry

| Nazwa      | Typ      | Opis                                 |
| ---------- | -------- | ------------------------------------ |
| `canvasId` | `string` | Identyfikator DOM docelowego elementu canvas. |

##### Zwraca

`RenderState`

##### Rzuca

| Warunek                       | Błąd                         |
| ----------------------------- | ---------------------------- |
| Nie można znaleźć elementu canvas | `Error("Canvas not found!")` |

##### Zachowanie

* Pobiera element canvas.
* Tworzy obiekt stanu renderowania.
* Wykonuje początkową zmianę rozmiaru.
* Rejestruje automatyczną obsługę zmiany rozmiaru obszaru widoku.

---

#### `resize(state: RenderState): void`

Zmienia rozmiar canvasa tak, aby odpowiadał rozmiarowi okna przeglądarki.

##### Parametry

| Nazwa   | Typ           |
| ------- | ------------- |
| `state` | `RenderState` |

##### Zachowanie

* Używa `window.devicePixelRatio` do obsługi wyświetlaczy o wysokim DPI.
* Aktualizuje wewnętrzną rozdzielczość canvasa.
* Aktualizuje rozmiar CSS canvasa.
* Resetuje transformację renderowania, aby odpowiadała skalowaniu współczynnikiem pikseli urządzenia.

---

#### `clear(state: RenderState): void`

Czyści cały canvas.

##### Parametry

| Nazwa   | Typ           |
| ------- | ------------- |
| `state` | `RenderState` |

##### Zachowanie

Usuwa całą wyrenderowaną zawartość z canvasa.

---

#### `drawCircle(state, x, y, radius, color): void`

Rysuje wypełniony okrąg.

##### Parametry

| Nazwa    | Typ           | Opis                 |
| -------- | ------------- | -------------------- |
| `state`  | `RenderState` | Stan renderowania.   |
| `x`      | `number`      | Współrzędna X środka. |
| `y`      | `number`      | Współrzędna Y środka. |
| `radius` | `number`      | Promień okręgu.      |
| `color`  | `string`      | Kolor wypełnienia.   |

---

#### `drawRect(state, x, y, width, height, color): void`

Rysuje wypełniony prostokąt.

##### Parametry

| Nazwa    | Typ           | Opis                    |
| -------- | ------------- | ---------------------- |
| `state`  | `RenderState` | Stan renderowania.     |
| `x`      | `number`      | Współrzędna X lewego górnego rogu. |
| `y`      | `number`      | Współrzędna Y lewego górnego rogu. |
| `width`  | `number`      | Szerokość prostokąta.  |
| `height` | `number`      | Wysokość prostokąta.   |
| `color`  | `string`      | Kolor wypełnienia.     |

---

#### `drawLine(state, x1, y1, x2, y2, color, lineWidth?): void`

Rysuje odcinek linii.

##### Parametry

| Nazwa       | Typ           | Opis                                  |
| ----------- | ------------- | ------------------------------------- |
| `state`     | `RenderState` | Stan renderowania.                    |
| `x1`        | `number`      | Początkowa współrzędna X.             |
| `y1`        | `number`      | Początkowa współrzędna Y.             |
| `x2`        | `number`      | Końcowa współrzędna X.                |
| `y2`        | `number`      | Końcowa współrzędna Y.                |
| `color`     | `string`      | Kolor obrysu.                         |
| `lineWidth` | `number`      | Opcjonalna szerokość linii. Domyślnie `1`. |

---

#### `drawText(state, text, x, y, color, font?): void`

Rysuje tekst na canvasie.

##### Parametry

| Nazwa   | Typ           | Opis                                                         |
| ------- | ------------- | ------------------------------------------------------------ |
| `state` | `RenderState` | Stan renderowania.                                           |
| `text`  | `string`      | Treść tekstu.                                                |
| `x`     | `number`      | Pozycja X tekstu.                                            |
| `y`     | `number`      | Pozycja Y linii bazowej tekstu.                              |
| `color` | `string`      | Kolor tekstu.                                                |
| `font`  | `string`      | Deklaracja czcionki CSS. Domyślnie `"16px sans-serif"`. |

### Zachowanie wewnętrzne

#### Renderowanie dla wysokiego DPI

Moduł skaluje canvas przy użyciu:

```ts
const dpr = window.devicePixelRatio || 1;
```

Zapewnia to, że wyrenderowana zawartość wygląda ostro na wyświetlaczach Retina i innych wyświetlaczach o wysokiej gęstości pikseli.

#### Rozmiar canvasa

Canvas utrzymuje dwa oddzielne rozmiary:

1. **Wewnętrzna rozdzielczość pikselowa**

   ```ts
   canvas.width
   canvas.height
   ```

2. **Wizualny rozmiar CSS**

   ```ts
   canvas.style.width
   canvas.style.height
   ```

Wewnętrzna rozdzielczość jest mnożona przez współczynnik pikseli urządzenia, podczas gdy rozmiar CSS odpowiada wymiarom obszaru widoku.

#### Układ współrzędnych

Po zmianie rozmiaru transformacja kontekstu jest resetowana:

```ts
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

Pozwala to operacjom rysowania nadal używać logicznych współrzędnych ekranu zamiast ręcznego skalowania wartości.

#### Strategia rysowania

Wszystkie funkcje pomocnicze rysowania operują bezpośrednio na współdzielonym `CanvasRenderingContext2D` przechowywanym w `RenderState`. Nie jest utrzymywany żaden graf sceny, buforowanie ani śledzenie obiektów.

### Przykład

```ts
import {
    createRenderState,
    clear,
    drawCircle,
    drawRect,
    drawLine,
    drawText
} from "./render";

const render = createRenderState("game-canvas");

function frame() {
    clear(render);

    drawRect(render, 50, 50, 200, 100, "#4caf50");
    drawCircle(render, 200, 200, 40, "#2196f3");
    drawLine(render, 100, 100, 300, 200, "#ffffff", 2);
    drawText(render, "Hello Canvas", 50, 300, "#000");

    requestAnimationFrame(frame);
}

frame();
```

### Powiązane elementy

* Element HTML `<canvas>`
* `CanvasRenderingContext2D`
* Zdarzenia zmiany rozmiaru `window` przeglądarki
* `window.devicePixelRatio`
* Pętle renderowania `requestAnimationFrame()`
* Interfejsy API rysowania Canvas 2D (`fillRect`, `arc`, `fillText`, `stroke`)