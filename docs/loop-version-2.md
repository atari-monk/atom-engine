## Loop (version 2)

- [Description](#description)
- [Code](#code)

### Description

- Game loop version 2
- ...

### Code

`src/loop.ts`:

```typescript
export interface LoopCallbacks {
  update: (dt: number) => void;
  render: (alpha: number) => void;
}

export interface LoopConfig {
  fixedDelta?: number;
  maxDelta?: number;
}

export interface Loop {
  readonly running: boolean;
  start: (callbacks: LoopCallbacks) => void;
  stop: () => void;
}

interface LoopRuntime {
  running: boolean;

  fixedDelta: number;
  maxDelta: number;

  lastTime: number | null;
  accumulator: number;
  frameId: number | null;
}

const DEFAULT_FIXED_DELTA = 1 / 60;
const DEFAULT_MAX_DELTA = 0.25;

export function createLoop(config: LoopConfig = {}): Loop {
  const fixedDelta = config.fixedDelta ?? DEFAULT_FIXED_DELTA;
  const maxDelta = config.maxDelta ?? DEFAULT_MAX_DELTA;

  validateConfig(fixedDelta, maxDelta);

  const runtime: LoopRuntime = {
    running: false,

    fixedDelta,
    maxDelta,

    lastTime: null,
    accumulator: 0,
    frameId: null,
  };

  return {
    get running() {
      return runtime.running;
    },

    start: (callbacks) => startLoop(runtime, callbacks),
    stop: () => stopLoop(runtime),
  };
}

function startLoop(runtime: LoopRuntime, callbacks: LoopCallbacks) {
  if (runtime.running) return;

  runtime.running = true;
  runtime.lastTime = null;

  runtime.frameId = requestAnimationFrame((timestamp) =>
    tick(runtime, callbacks, timestamp),
  );
}

function stopLoop(runtime: LoopRuntime) {
  if (!runtime.running) return;

  runtime.running = false;

  if (runtime.frameId !== null) {
    cancelAnimationFrame(runtime.frameId);
    runtime.frameId = null;
  }

  runtime.lastTime = null;
}

function tick(
  runtime: LoopRuntime,
  callbacks: LoopCallbacks,
  timestamp: number,
) {
  if (!runtime.running) return;

  if (runtime.lastTime === null) {
    runtime.lastTime = timestamp;
  }

  const delta = Math.min(
    (timestamp - runtime.lastTime) / 1000,
    runtime.maxDelta,
  );

  runtime.lastTime = timestamp;
  runtime.accumulator += delta;

  while (runtime.accumulator >= runtime.fixedDelta) {
    callbacks.update(runtime.fixedDelta);
    runtime.accumulator -= runtime.fixedDelta;
  }

  const alpha = runtime.accumulator / runtime.fixedDelta;

  callbacks.render(alpha);

  runtime.frameId = requestAnimationFrame((timestamp) =>
    tick(runtime, callbacks, timestamp),
  );
}

function validateConfig(fixedDelta: number, maxDelta: number) {
  if (!Number.isFinite(fixedDelta) || fixedDelta <= 0) {
    throw new RangeError(
      `fixedDelta must be a finite number greater than 0. Received: ${fixedDelta}`,
    );
  }

  if (!Number.isFinite(maxDelta) || maxDelta <= 0) {
    throw new RangeError(
      `maxDelta must be a finite number greater than 0. Received: ${maxDelta}`,
    );
  }

  if (maxDelta < fixedDelta) {
    throw new RangeError(
      `maxDelta must be greater than or equal to fixedDelta. ` +
        `Received fixedDelta: ${fixedDelta}, maxDelta: ${maxDelta}`,
    );
  }
}
```
