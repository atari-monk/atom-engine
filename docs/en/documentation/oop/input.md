## Input

### Purpose

The `Input` class is a high-level wrapper around a low-level input system. It manages keyboard state tracking, including key presses and held states, while optionally filtering out “blocked” keys (e.g., arrow keys, space, and specific action keys). It provides a simplified API for querying input state in game loops or interactive applications.

---

### Lifecycle

Creation → Update → Destruction

- **Creation**
  - An `InputState` is created via `createInputState(blockedKeys)`.
  - Global or event-based listeners are attached using `attachInput`.
  - The instance begins tracking keyboard input immediately.

- **Update**
  - The internal `InputState` is updated implicitly via event listeners.
  - Consumers query state through `isDown` and `isPressed`.
  - Pressed-state transitions are typically frame-based and must be cleared manually.

- **Destruction**
  - No explicit teardown is implemented in this class.
  - If needed, cleanup must be handled externally in the underlying input system.

---

### Public API

#### `constructor(blockedKeys?: string[])`

Creates a new input handler instance.

- **Parameters**
  - `blockedKeys` (optional): Array of key identifiers to ignore in input processing.
    - Default: `["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "e"]`

---

#### `isDown(key: string): boolean`

Checks whether a key is currently being held down.

- **Returns**
  - `true` if the key is currently pressed
  - `false` otherwise

---

#### `isPressed(key: string): boolean`

Checks whether a key was pressed during the current update cycle.

- **Returns**
  - `true` if the key transitioned from up → down in the current frame
  - `false` otherwise

---

#### `clearPressed(): void`

Resets all “pressed” states.

- Typically called once per frame after input has been processed.

---

#### `getState(): InputState`

Returns the underlying input state object.

- **Returns**
  - The internal `InputState` instance used for tracking input

---

### Internal Behavior

- The class depends on an external input module (`../input`) that provides:
  - `InputState` type
  - `createInputState(blockedKeys)` for initialization
  - `attachInput(state)` for registering event listeners
  - `isKeyDown(state, key)` for continuous input checks
  - `isKeyPressed(state, key)` for edge-triggered input detection
  - `clearPressed(state)` for resetting per-frame press flags

- `blockedKeys` are passed at initialization and used by the underlying system to filter unwanted or reserved inputs.

- The class itself does not directly listen to events; it delegates all input tracking to the shared `InputState`.

- It acts as a thin abstraction layer to simplify usage in game loops or UI systems.

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

- `InputState` – Internal structure storing key states
- `createInputState` – Initializes input tracking state
- `attachInput` – Hooks keyboard event listeners
- `isKeyDown` – Checks continuous key state
- `isKeyPressed` – Checks edge-triggered key state
- `clearPressed` – Resets per-frame key press flags