## Moduł Narzędzi Renderowania

### Cel

Zapewnia lekki wrapper wokół kontekstu renderowania HTML5 Canvas 2D. Moduł odpowiada za:

* Tworzenie i zarządzanie stanem renderowania (`RenderState`)
* Automatyczne zmienianie rozmiaru canvas w celu dopasowania do obszaru widoku przeglądarki
* Obsługę wyświetlaczy o wysokim DPI (Retina) poprzez skalowanie współczynnikiem pikseli urządzenia
* Oferowanie prostych funkcji pomocniczych do rysowania typowych prymitywów:

  * Okręgi
  * Prostokąty
  * Linie
  * Tekst
* Czyszczenie canvas pomiędzy klatkami renderowania

---

### Cykl życia

**Tworzenie → Aktualizacja → Zniszczenie**

#### Tworzenie

1. Wywołaj `createRenderState(canvasId)`.
2. Docelowy element canvas jest pobierany z DOM.
3. Tworzony jest kontekst renderowania 2D.
4. Inicjalizowany jest obiekt `RenderState`.
5. Rozmiar canvas jest zmieniany tak, aby odpowiadał bieżącym wymiarom okna.
6. Rejestrowany jest nasłuchiwacz zmiany rozmiaru okna, aby utrzymać synchronizację canvas ze zmianami obszaru widoku.

#### Aktualizacja

Podczas renderowania:

1. Opcjonalnie wyczyść canvas za pomocą `clear()`.
2. Rysuj prymitywy za pomocą:

   * `drawCircle()`
   * `drawRect()`
   * `drawLine()`
   * `drawText()`
3. Gdy okno przeglądarki zmieni rozmiar, `resize()` jest wywoływane automatycznie.

#### Zniszczenie

Ten moduł nie zapewnia jawnego czyszczenia zasobów.

Klienci, którzy dynamicznie tworzą i niszczą renderery, powinni usunąć zarejestrowany nasłuchiwacz zmiany rozmiaru, jeśli wymagane jest zarządzanie cyklem życia.

---

### Publiczne API

#### `RenderState`

Reprezentuje aktywne środowisko renderowania.

```ts
interface RenderState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}
```

| Właściwość | Typ                        | Opis                                                    |
| ---------- | -------------------------- | ------------------------------------------------------- |
| `canvas`   | `HTMLCanvasElement`        | Docelowy element canvas.                                |
| `ctx`      | `CanvasRenderingContext2D` | Kontekst rysowania 2D używany do operacji renderowania. |

---

#### `createRenderState(canvasId: string): RenderState`

Tworzy i inicjalizuje stan renderowania.

##### Parametry

| Nazwa      | Typ      | Opis                                          |
| ---------- | -------- | --------------------------------------------- |
| `canvasId` | `string` | Identyfikator DOM docelowego elementu canvas. |

##### Zwraca

```ts
RenderState
```

##### Zgłasza

```ts
Error("Canvas not found!")
```

Jeśli nie istnieje canvas o podanym identyfikatorze.

##### Odpowiedzialności

* Pobiera element canvas.
* Tworzy kontekst renderowania 2D.
* Wykonuje początkowe dopasowanie rozmiaru.
* Rejestruje automatyczną obsługę zmiany rozmiaru.

---

#### `resize(state: RenderState): void`

Zmienia rozmiar canvas tak, aby wypełniał obszar widoku przeglądarki.

##### Parametry

| Nazwa   | Typ           |
| ------- | ------------- |
| `state` | `RenderState` |

##### Zachowanie

* Używa `window.devicePixelRatio` do renderowania w wysokim DPI.
* Aktualizuje wewnętrzną rozdzielczość canvas.
* Aktualizuje wyświetlany rozmiar canvas za pomocą CSS.
* Resetuje transformację renderowania, aby współrzędne rysowania pozostały w pikselach CSS.

---

#### `clear(state: RenderState): void`

Czyści cały canvas.

##### Parametry

| Nazwa   | Typ           |
| ------- | ------------- |
| `state` | `RenderState` |

##### Zachowanie

```ts
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

Usuwa całą wcześniej wyrenderowaną zawartość.

---

#### `drawCircle(

```
state,
x,
y,
radius,
color
```

): void`

Rysuje wypełniony okrąg.

##### Parametry

| Nazwa    | Typ           | Opis                  |
| -------- | ------------- | --------------------- |
| `state`  | `RenderState` | Stan renderowania.    |
| `x`      | `number`      | Współrzędna X środka. |
| `y`      | `number`      | Współrzędna Y środka. |
| `radius` | `number`      | Promień okręgu.       |
| `color`  | `string`      | Kolor wypełnienia.    |

---

#### `drawRect(

```
state,
x,
y,
width,
height,
color
```

): void`

Rysuje wypełniony prostokąt.

##### Parametry

| Nazwa    | Typ           | Opis                  |
| -------- | ------------- | --------------------- |
| `state`  | `RenderState` | Stan renderowania.    |
| `x`      | `number`      | Pozycja lewa.         |
| `y`      | `number`      | Pozycja górna.        |
| `width`  | `number`      | Szerokość prostokąta. |
| `height` | `number`      | Wysokość prostokąta.  |
| `color`  | `string`      | Kolor wypełnienia.    |

---

#### `drawLine(

```
state,
x1,
y1,
x2,
y2,
color,
lineWidth?
```

): void`

Rysuje odcinek linii.

##### Parametry

| Nazwa       | Typ           | Opis                             |
| ----------- | ------------- | -------------------------------- |
| `state`     | `RenderState` | Stan renderowania.               |
| `x1`        | `number`      | Początkowa współrzędna X.        |
| `y1`        | `number`      | Początkowa współrzędna Y.        |
| `x2`        | `number`      | Końcowa współrzędna X.           |
| `y2`        | `number`      | Końcowa współrzędna Y.           |
| `color`     | `string`      | Kolor obrysu.                    |
| `lineWidth` | `number`      | Szerokość obrysu. Domyślnie `1`. |

---

#### `drawText(

```
state,
text,
x,
y,
color,
font?
```

): void`

Rysuje tekst na canvas.

##### Parametry

| Nazwa   | Typ           | Opis                                                      |
| ------- | ------------- | --------------------------------------------------------- |
| `state` | `RenderState` | Stan renderowania.                                        |
| `text`  | `string`      | Zawartość tekstowa.                                       |
| `x`     | `number`      | Współrzędna X tekstu.                                     |
| `y`     | `number`      | Współrzędna Y tekstu.                                     |
| `color` | `string`      | Kolor tekstu.                                             |
| `font`  | `string`      | Definicja czcionki canvas. Domyślnie `"16px sans-serif"`. |

---

### Zachowanie Wewnętrzne

#### Renderowanie w Wysokim DPI

Moduł kompensuje wyświetlacze o wysokiej gęstości pikseli poprzez skalowanie bazowej rozdzielczości canvas przy użyciu:

```ts
const dpr = window.devicePixelRatio || 1;
```

Wymiary canvas w pikselach są mnożone przez `dpr`, podczas gdy wyświetlany rozmiar pozostaje równy rozmiarowi obszaru widoku.

Przykład:

```text
Obszar widoku: 1920 × 1080
DPR: 2

Rozdzielczość canvas:
3840 × 2160

Wyświetlany rozmiar:
1920 × 1080
```

Zapobiega to rozmytemu renderowaniu na ekranach Retina i innych ekranach o wysokiej gęstości pikseli.

#### Układ Współrzędnych

Po zmianie rozmiaru transformacja jest resetowana:

```ts
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

Zapewnia to, że funkcje rysowania nadal używają współrzędnych pikseli obszaru widoku zamiast przeskalowanych współrzędnych urządzenia.

#### Synchronizacja Zmiany Rozmiaru

Podczas inicjalizacji rejestrowany jest nasłuchiwacz zmiany rozmiaru:

```ts
window.addEventListener("resize", () => resize(state));
```

Za każdym razem, gdy rozmiar okna przeglądarki się zmienia, rozdzielczość canvas i jego wyświetlane wymiary są automatycznie przeliczane.

---

### Przykład

```ts
const render = createRenderState("gameCanvas");

function frame() {
    clear(render);

    drawCircle(render, 200, 150, 40, "red");
    drawRect(render, 300, 100, 120, 80, "blue");
    drawLine(render, 50, 50, 250, 200, "white", 2);
    drawText(render, "Hello Canvas", 20, 30, "yellow");

    requestAnimationFrame(frame);
}

frame();
```

```html
<canvas id="gameCanvas"></canvas>
```

---

### Powiązane Elementy

* `HTMLCanvasElement`
* `CanvasRenderingContext2D`
* `window.devicePixelRatio`
* `requestAnimationFrame()`
* Prymitywy rysowania Canvas 2D API (`arc`, `fillRect`, `lineTo`, `fillText`)