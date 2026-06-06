## Fixed Timestep Game Loop

### Purpose

This module implements a fixed timestep game loop using `requestAnimationFrame`, with support for:
- Deterministic updates via a fixed `delta time`
- Accumulation of excess frame time
- Interpolated rendering using an `alpha` value

It is commonly used in games and simulations where stable physics updates are required regardless of frame rate fluctuations.

---

### Lifecycle

Creation → Start → Update/Render Loop → Stop

1. **Creation**: A loop state is created via `createLoop`
2. **Start**: The loop begins via `startLoop`
3. **Update/Render Loop**: Repeated `tick` calls manage update and render phases
4. **Stop**: The loop is halted via `stopLoop`

---

### Public API

### `LoopState`

Represents the internal state of the loop.

- `lastTime: number`  
  Timestamp of the last frame (in milliseconds)

- `accumulator: number`  
  Accumulated time not yet processed by fixed updates

- `fixedDelta: number`  
  Fixed timestep duration in seconds (default: 1/60)

- `update(dt: number): void`  
  Function called at fixed intervals with `dt = fixedDelta`

- `render(alpha: number): void`  
  Render function called once per frame with interpolation factor

- `running: boolean`  
  Whether the loop is currently active

- `frameId: number | null`  
  Current `requestAnimationFrame` ID

---

### `createLoop(update, render, fixedDelta?)`

Creates and returns a new loop state.

**Parameters**
- `update(dt: number)` – fixed-step update function
- `render(alpha: number)` – interpolated render function
- `fixedDelta?: number` – timestep in seconds (default: 1/60)

**Returns**
- `LoopState`

---

### `startLoop(state)`

Starts the animation loop if it is not already running.

**Behavior**
- Sets `running = true`
- Schedules the first `requestAnimationFrame` callback
- Prevents duplicate starts

---

### `stopLoop(state)`

Stops the loop and cancels pending animation frames.

**Behavior**
- Sets `running = false`
- Cancels scheduled frame via `cancelAnimationFrame`
- Clears `frameId`

---

### Internal Behavior

### `tick(state, time)`

Core loop function executed every animation frame.

#### Steps:

1. **Guard Clause**
   - Exits immediately if `state.running` is false

2. **Initialize Time**
   - On first frame, sets `lastTime = time`

3. **Delta Calculation**
   - Computes elapsed time in seconds:
     ```
     delta = (time - lastTime) / 1000
     ```
   - Clamps delta to a maximum of `0.25s` to avoid spiral-of-death on lag spikes

4. **Accumulate Time**
   - Adds delta to `state.accumulator`

5. **Fixed Updates**
   - Runs `state.update(fixedDelta)` as many times as needed:
     ```
     while (accumulator >= fixedDelta)
     ```
   - Ensures deterministic simulation steps

6. **Interpolation Factor**
   - Computes:
     ```
     alpha = accumulator / fixedDelta
     ```
   - Used for smooth rendering between fixed updates

7. **Render Call**
   - Calls `state.render(alpha)`

8. **Loop Continuation**
   - Schedules next frame via `requestAnimationFrame`

---

### Example

```ts
const loop = createLoop(
    (dt) => {
        // physics / game logic update
        position += velocity * dt;
    },
    (alpha) => {
        // interpolation for smooth rendering
        renderSprite(position + velocity * alpha);
    }
);

startLoop(loop);

// later...
stopLoop(loop);
```

---

### Related Elements

- `requestAnimationFrame` — browser API used for frame scheduling
- Fixed timestep game loop — simulation pattern used in physics engines
- Interpolation rendering — technique for smoothing visual updates between simulation steps