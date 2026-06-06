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
    fixedDelta: number = 1 / 60
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