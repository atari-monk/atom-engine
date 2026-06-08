## Input State System

### Purpose

This module provides a lightweight keyboard input tracking system for browser-based applications (commonly games or interactive simulations). It maintains real-time state for currently held keys, newly pressed keys (per frame), and optionally blocks default browser behavior for specific keys.

It is designed to support both continuous input (e.g., movement while holding a key) and discrete input events (e.g., single press actions).

---

### Lifecycle

Creation → Update → Destruction

**Creation**
- `createInputState()` initializes the input state object with empty tracking sets and optional blocked keys.

**Update**
- `attachInput()` registers global `keydown` and `keyup` listeners on `window`.
- The state is continuously updated as the user interacts with the keyboard.

**Per-frame maintenance**
- `clearPressed()` is typically called once per update/frame cycle to reset “just pressed” state.

**Destruction**
- This module does not provide a cleanup function for event listeners; removal must be handled externally if needed.

---

### Public API

#### `InputState`

```ts
type InputState = {
    keys: Set<string>;
    pressed: Set<string>;
    blockedKeys: Set<string>;
};
```

- `keys`: All keys currently held down.
- `pressed`: Keys that were pressed once (non-repeating) since the last reset.
- `blockedKeys`: Keys whose default browser behavior should be prevented.

---

#### `createInputState(blockedKeys?: string[]): InputState`

Creates and returns a new input state object.

- `blockedKeys` (optional): List of key values whose default browser behavior should be prevented.
- Default blocked keys:
  - Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`)
  - Space (`" "`)
  - `"e"`

---

#### `attachInput(state: InputState): void`

Registers global keyboard event listeners and updates the provided state:

- On `keydown`:
  - Adds key to `keys`
  - Adds key to `pressed` only if it is not an auto-repeated event
  - Prevents default behavior if key is in `blockedKeys`

- On `keyup`:
  - Removes key from `keys`
  - Prevents default behavior if key is in `blockedKeys`

---

#### `clearPressed(state: InputState): void`

Clears the `pressed` set.

- Typically called once per frame/tick in a game loop.
- Ensures `pressed` only reflects keys triggered since the last update cycle.

---

#### `isKeyDown(state: InputState, key: string): boolean`

Returns whether a key is currently being held down.

- Checks membership in `state.keys`.

---

#### `isKeyPressed(state: InputState, key: string): boolean`

Returns whether a key was pressed once since the last `clearPressed()` call.

- Checks membership in `state.pressed`.

---

### Internal Behavior

#### Key Tracking Model

The system distinguishes between:

- **Continuous state (`keys`)**
  - Updated on both `keydown` and `keyup`
  - Reflects real-time held keys

- **Edge-triggered state (`pressed`)**
  - Updated only on initial `keydown` events (`e.repeat === false`)
  - Designed for one-time actions (e.g., jumping, shooting, confirming input)

#### Event Handling

- Uses global `window.addEventListener` for keyboard events.
- Relies on browser `KeyboardEvent.key` values.
- Prevents default browser behavior for keys in `blockedKeys`, useful for:
  - Preventing page scrolling (arrow keys, space)
  - Preventing accidental navigation or input conflicts

#### Limitations

- No built-in cleanup/unsubscribe mechanism for event listeners.
- Uses global event listeners (not scoped to a component or element).
- No support for key remapping beyond `blockedKeys`.

---

### Example

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

### Related Elements

- `KeyboardEvent` (Web API)
- Game loop / frame update systems
- Input buffering systems in game engines
- State management patterns for real-time interaction