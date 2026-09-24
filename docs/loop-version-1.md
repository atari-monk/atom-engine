## Loop (version 1)

- [Description](#description)
- [Code](#code)
- [Review](#review)

### Description

- Game loop version 1
- Single struct with state
- Functions create, start, stop, tick
- Takes update and render functions that define game
- Provides game loop

### Code

`src/loop.ts`:

```typescript
export interface LoopState {
  lastTime: number;
  accumulator: number;
  fixedDelta: number;
  update: (dt: number) => void;
  render: (alpha: number) => void;
  running: boolean;
  frameId: number | null;
}

export function createLoop(
  update: (dt: number) => void,
  render: (alpha: number) => void,
  fixedDelta: number = 1 / 60,
): LoopState {
  return {
    lastTime: 0,
    accumulator: 0,
    fixedDelta,
    update,
    render,
    running: false,
    frameId: null,
  };
}

export function startLoop(state: LoopState) {
  if (state.running) return;
  state.running = true;
  state.frameId = requestAnimationFrame((time) => tick(state, time));
}

export function stopLoop(state: LoopState) {
  if (!state.running) return;
  state.running = false;
  if (state.frameId !== null) {
    cancelAnimationFrame(state.frameId);
    state.frameId = null;
  }
}

function tick(state: LoopState, time: number) {
  if (!state.running) return;

  if (!state.lastTime) {
    state.lastTime = time;
  }

  const delta = Math.min((time - state.lastTime) / 1000, 0.25);
  state.lastTime = time;
  state.accumulator += delta;

  while (state.accumulator >= state.fixedDelta) {
    state.update(state.fixedDelta);
    state.accumulator -= state.fixedDelta;
  }

  const alpha = state.accumulator / state.fixedDelta;
  state.render(alpha);

  state.frameId = requestAnimationFrame((t) => tick(state, t));
}
```

### Review

Reading code line by line and commenting what it does.

```typescript
//Data representing state of loop
export interface LoopState {
  //Stores timestamp of the previous animation frame
  lastTime: number;

  //Accumulates frame times
  accumulator: number;

  //Fixed time interval used for each physics update
  fixedDelta: number;

  //Main entrypoint for game update
  update: (dt: number) => void;

  //Main entrypoint for game render
  render: (alpha: number) => void;

  //Flag represents loop on/off state
  running: boolean;

  //ID of the scheduled animation frame
  frameId: number | null;
}

//Provides initial data and main functions for a game loop
export function createLoop(
  update: (dt: number) => void,
  render: (alpha: number) => void,
  //Fixed time interval used for each physics update
  fixedDelta: number = 1 / 60,
): LoopState {
  return {
    lastTime: 0,
    accumulator: 0,
    fixedDelta,
    update,
    render,
    running: false,
    frameId: null,
  };
}

//Starts loop
export function startLoop(state: LoopState) {
  //Does nothing if loop runs
  if (state.running) return;

  //Sets run flag to on
  state.running = true;

  //Requests tick to be run on next animation frame
  state.frameId = requestAnimationFrame((time) => tick(state, time));
}

//Stops loop
export function stopLoop(state: LoopState) {
  //Does nothing if loop is off
  if (!state.running) return;

  //Set run flag to off
  state.running = false;

  //If there is frame id
  if (state.frameId !== null) {
    //cancel animation frame
    cancelAnimationFrame(state.frameId);

    //set frame to null
    state.frameId = null;
  }
}

//Calculates frame
function tick(state: LoopState, time: number) {
  //Does nothing if run flag is off
  if (!state.running) return;

  //This causes the first tick to have delta = 0
  //That's intentional and prevents the game from trying to simulate some arbitrary amount of time on its first frame.
  if (!state.lastTime) {
    state.lastTime = time;
  }

  //Calculate delta in seconds, capped at 0.25s to prevent a long freeze from causing a huge physics catch-up
  const delta = Math.min((time - state.lastTime) / 1000, 0.25);

  //sets timestamp of last frame
  state.lastTime = time;

  //accumulates elapsed time
  state.accumulator += delta;

  //While enough accumulated time exists for another fixed update
  //That means physics update can be run multiple times with fixed interval per one render
  while (state.accumulator >= state.fixedDelta) {
    //Update game for fixed interval
    state.update(state.fixedDelta);

    //Decrease accumulated time counter
    state.accumulator -= state.fixedDelta;
  }

  //Alpha mesures how far the accumulator has progressed toward the next fixed update
  //previous state ---- alpha ----> current state
  //Renderer can use alpha to interpolate between simulation states for smoother movement.
  const alpha = state.accumulator / state.fixedDelta;

  //Render happens every frame while update in fixed intervals
  state.render(alpha);

  //Requests tick to be run on next animation frame
  state.frameId = requestAnimationFrame((t) => tick(state, t));
}
```
