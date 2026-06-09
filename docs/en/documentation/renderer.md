## Render Utilities Module

### Purpose

Provides a lightweight canvas rendering abstraction for HTML5 `<canvas>` elements. The module:

* Creates and manages a rendering state (`RenderState`)
* Handles automatic canvas resizing and high-DPI (Retina) scaling
* Exposes utility functions for clearing the canvas
* Provides basic drawing primitives:

  * Circles
  * Rectangles
  * Lines
  * Text

This module is intended to simplify common 2D canvas setup and rendering operations.

### Lifecycle

**Creation → Update → Destruction**

#### Creation

1. Call `createRenderState(canvasId)`.
2. The target canvas element is located in the DOM.
3. A 2D rendering context is acquired.
4. The canvas is resized to match the browser viewport.
5. A window resize listener is registered.

#### Update

1. Rendering functions (`drawCircle`, `drawRect`, `drawLine`, `drawText`) are called each frame or whenever visual updates are needed.
2. `clear()` can be used to reset the canvas before redrawing.
3. When the browser window changes size, `resize()` is automatically invoked.

#### Destruction

This module does not provide explicit cleanup functionality.

The registered resize event listener remains active for the lifetime of the page. If disposal behavior is required, additional logic should be implemented to remove the listener.

### Public API

#### `interface RenderState`

Represents the rendering environment.

| Property | Type                       | Description                            |
| -------- | -------------------------- | -------------------------------------- |
| `canvas` | `HTMLCanvasElement`        | Target canvas element.                 |
| `ctx`    | `CanvasRenderingContext2D` | 2D rendering context used for drawing. |

---

#### `createRenderState(canvasId: string): RenderState`

Creates and initializes a rendering state.

##### Parameters

| Name       | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `canvasId` | `string` | DOM id of the target canvas element. |

##### Returns

`RenderState`

##### Throws

| Condition                      | Error                        |
| ------------------------------ | ---------------------------- |
| Canvas element cannot be found | `Error("Canvas not found!")` |

##### Behavior

* Retrieves the canvas element.
* Creates a rendering state object.
* Performs an initial resize.
* Registers automatic viewport resize handling.

---

#### `resize(state: RenderState): void`

Resizes the canvas to match the browser window.

##### Parameters

| Name    | Type          |
| ------- | ------------- |
| `state` | `RenderState` |

##### Behavior

* Uses `window.devicePixelRatio` to support high-DPI displays.
* Updates the canvas internal resolution.
* Updates the canvas CSS size.
* Resets the rendering transform to match device pixel ratio scaling.

---

#### `clear(state: RenderState): void`

Clears the entire canvas.

##### Parameters

| Name    | Type          |
| ------- | ------------- |
| `state` | `RenderState` |

##### Behavior

Removes all rendered content from the canvas.

---

#### `drawCircle(state, x, y, radius, color): void`

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

#### `drawRect(state, x, y, width, height, color): void`

Draws a filled rectangle.

##### Parameters

| Name     | Type          | Description            |
| -------- | ------------- | ---------------------- |
| `state`  | `RenderState` | Render state.          |
| `x`      | `number`      | Top-left X coordinate. |
| `y`      | `number`      | Top-left Y coordinate. |
| `width`  | `number`      | Rectangle width.       |
| `height` | `number`      | Rectangle height.      |
| `color`  | `string`      | Fill color.            |

---

#### `drawLine(state, x1, y1, x2, y2, color, lineWidth?): void`

Draws a line segment.

##### Parameters

| Name        | Type          | Description                           |
| ----------- | ------------- | ------------------------------------- |
| `state`     | `RenderState` | Render state.                         |
| `x1`        | `number`      | Start X coordinate.                   |
| `y1`        | `number`      | Start Y coordinate.                   |
| `x2`        | `number`      | End X coordinate.                     |
| `y2`        | `number`      | End Y coordinate.                     |
| `color`     | `string`      | Stroke color.                         |
| `lineWidth` | `number`      | Optional line width. Defaults to `1`. |

---

#### `drawText(state, text, x, y, color, font?): void`

Draws text on the canvas.

##### Parameters

| Name    | Type          | Description                                            |
| ------- | ------------- | ------------------------------------------------------ |
| `state` | `RenderState` | Render state.                                          |
| `text`  | `string`      | Text content.                                          |
| `x`     | `number`      | Text X position.                                       |
| `y`     | `number`      | Text baseline Y position.                              |
| `color` | `string`      | Text color.                                            |
| `font`  | `string`      | CSS font declaration. Defaults to `"16px sans-serif"`. |

### Internal Behavior

#### High-DPI Rendering

The module scales the canvas using:

```ts
const dpr = window.devicePixelRatio || 1;
```

This ensures rendered content appears sharp on Retina and other high-density displays.

#### Canvas Sizing

The canvas maintains two separate sizes:

1. **Internal pixel resolution**

   ```ts
   canvas.width
   canvas.height
   ```

2. **Visual CSS size**

   ```ts
   canvas.style.width
   canvas.style.height
   ```

The internal resolution is multiplied by the device pixel ratio while the CSS size matches the viewport dimensions.

#### Coordinate System

After resizing, the context transform is reset:

```ts
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

This allows drawing operations to continue using logical screen coordinates rather than manually scaling values.

#### Drawing Strategy

All drawing helpers operate directly on the shared `CanvasRenderingContext2D` stored in `RenderState`. No scene graph, buffering, or object tracking is maintained.

### Example

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

### Related Elements

* HTML `<canvas>` element
* `CanvasRenderingContext2D`
* Browser `window` resize events
* `window.devicePixelRatio`
* `requestAnimationFrame()` rendering loops
* Canvas 2D drawing APIs (`fillRect`, `arc`, `fillText`, `stroke`)