## GameLoop

### Purpose

`GameLoop` is a high-level wrapper around a low-level loop system. It encapsulates the creation and management of a game loop that repeatedly executes update and render functions at a fixed timestep. It simplifies starting, stopping, and querying the state of the loop.

### Lifecycle
Creation → Update → Destruction

- **Creation**: A `GameLoop` instance is constructed with `update` and `render` callbacks. Internally, it initializes loop state via `createLoop`.
- **Update**: Once started, the loop repeatedly invokes the provided `update(dt)` and `render(alpha)` functions according to the underlying loop implementation.
- **Destruction**: The loop can be stopped via `stop()`, which halts execution. The instance itself does not explicitly release resources beyond stopping the loop.

### Public API

- **constructor(update, render, fixedDelta?)**
  - `update(dt: number)`: Function called each tick with delta time.
  - `render(alpha: number)`: Function called for rendering interpolation.
  - `fixedDelta?: number`: Fixed timestep interval (default: 1/60).

- **start(): void**
  - Starts the internal loop execution.

- **stop(): void**
  - Stops the internal loop execution.

- **isRunning(): boolean**
  - Returns whether the loop is currently active.

### Internal Behavior

- Maintains an internal `LoopState` object created by `createLoop(update, render, fixedDelta)`.
- Delegates execution control to external loop utilities:
  - `startLoop(state)` begins the loop.
  - `stopLoop(state)` halts the loop.
- The `state.running` flag is used to determine whether the loop is active.
- The class itself does not implement timing logic; it acts as a thin orchestration layer over the loop system.

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

- `LoopState`
- `createLoop`
- `startLoop`
- `stopLoop`