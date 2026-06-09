## Render Utilities Module

### Purpose

Provides a lightweight wrapper around the HTML5 Canvas 2D rendering context. The module is responsible for:

* Creating and managing a rendering state (`RenderState`)
* Automatically resizing the canvas to match the browser viewport
* Handling high-DPI (Retina) displays through device pixel ratio scaling
* Offering simple drawing helper functions for common primitives:

  * Circles
  * Rectangles
  * Lines
  * Text
* Clearing the canvas between render frames

---

### Lifecycle

**Creation → Update → Destruction**

#### Creation

1. Call `createRenderState(canvasId)`.
2. The target canvas element is retrieved from the DOM.
3. A 2D rendering context is created.
4. A `RenderState` object is initialized.
5. The canvas is resized to match the current window dimensions.
6. A window resize listener is registered to keep the canvas synchronized with viewport changes.

#### Update

During rendering:

1. Optionally clear the canvas using `clear()`.
2. Draw primitives using:

   * `drawCircle()`
   * `drawRect()`
   * `drawLine()`
   * `drawText()`
3. When the browser window changes size, `resize()` is automatically invoked.

#### Destruction

This module does not provide explicit cleanup.

Consumers that dynamically create and destroy renderers should remove the registered resize listener if lifecycle management is required.

---

### Public API

#### `RenderState`

Represents the active rendering environment.

```ts
interface RenderState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}
```

| Property | Type                       | Description                                       |
| -------- | -------------------------- | ------------------------------------------------- |
| `canvas` | `HTMLCanvasElement`        | Target canvas element.                            |
| `ctx`    | `CanvasRenderingContext2D` | 2D drawing context used for rendering operations. |

---

#### `createRenderState(canvasId: string): RenderState`

Creates and initializes a rendering state.

##### Parameters

| Name       | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `canvasId` | `string` | DOM id of the target canvas element. |

##### Returns

```ts
RenderState
```

##### Throws

```ts
Error("Canvas not found!")
```

If no canvas exists with the specified id.

##### Responsibilities

* Retrieves the canvas element.
* Creates the 2D rendering context.
* Performs initial sizing.
* Registers automatic resize handling.

---

#### `resize(state: RenderState): void`

Resizes the canvas to fill the browser viewport.

##### Parameters

| Name    | Type          |
| ------- | ------------- |
| `state` | `RenderState` |

##### Behavior

* Uses `window.devicePixelRatio` for high-DPI rendering.
* Updates the internal canvas resolution.
* Updates the displayed canvas size through CSS.
* Resets the rendering transform so drawing coordinates remain in CSS pixels.

---

#### `clear(state: RenderState): void`

Clears the entire canvas.

##### Parameters

| Name    | Type          |
| ------- | ------------- |
| `state` | `RenderState` |

##### Behavior

```ts
ctx.clearRect(0, 0, canvas.width, canvas.height);
```

Removes all previously rendered content.

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

Draws a filled circle.

##### Parameters

| Name     | Type          | Description          |
| -------- | ------------- | -------------------- |
| `state`  | `RenderState` | Render state.        |
| `x`      | `number`      | Center X coordinate. |
| `y`      | `number`      | Center Y coordinate. |
| `radius` | `number`      | Circle radius.       |
| `color`  | `string`      | Fill color.          |

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

Draws a filled rectangle.

##### Parameters

| Name     | Type          | Description       |
| -------- | ------------- | ----------------- |
| `state`  | `RenderState` | Render state.     |
| `x`      | `number`      | Left position.    |
| `y`      | `number`      | Top position.     |
| `width`  | `number`      | Rectangle width.  |
| `height` | `number`      | Rectangle height. |
| `color`  | `string`      | Fill color.       |

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

Draws a line segment.

##### Parameters

| Name        | Type          | Description                    |
| ----------- | ------------- | ------------------------------ |
| `state`     | `RenderState` | Render state.                  |
| `x1`        | `number`      | Start X coordinate.            |
| `y1`        | `number`      | Start Y coordinate.            |
| `x2`        | `number`      | End X coordinate.              |
| `y2`        | `number`      | End Y coordinate.              |
| `color`     | `string`      | Stroke color.                  |
| `lineWidth` | `number`      | Stroke width. Defaults to `1`. |

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

Draws text on the canvas.

##### Parameters

| Name    | Type          | Description                                              |
| ------- | ------------- | -------------------------------------------------------- |
| `state` | `RenderState` | Render state.                                            |
| `text`  | `string`      | Text content.                                            |
| `x`     | `number`      | Text X coordinate.                                       |
| `y`     | `number`      | Text Y coordinate.                                       |
| `color` | `string`      | Text color.                                              |
| `font`  | `string`      | Canvas font definition. Defaults to `"16px sans-serif"`. |

---

### Internal Behavior

#### High-DPI Rendering

The module compensates for high-density displays by scaling the canvas backing resolution using:

```ts
const dpr = window.devicePixelRatio || 1;
```

The canvas pixel dimensions are multiplied by `dpr`, while the displayed size remains equal to the viewport size.

Example:

```text
Viewport: 1920 × 1080
DPR: 2

Canvas resolution:
3840 × 2160

Displayed size:
1920 × 1080
```

This prevents blurry rendering on Retina and other high-density screens.

#### Coordinate System

After resizing, the transform is reset:

```ts
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

This ensures drawing functions continue to use viewport pixel coordinates rather than scaled device coordinates.

#### Resize Synchronization

A resize listener is registered during initialization:

```ts
window.addEventListener("resize", () => resize(state));
```

Whenever the browser window changes size, the canvas resolution and display dimensions are recalculated automatically.

---

### Example

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

### Related Elements

* `HTMLCanvasElement`
* `CanvasRenderingContext2D`
* `window.devicePixelRatio`
* `requestAnimationFrame()`
* Canvas 2D API drawing primitives (`arc`, `fillRect`, `lineTo`, `fillText`)