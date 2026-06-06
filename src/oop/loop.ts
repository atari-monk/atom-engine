import { type LoopState, createLoop, startLoop, stopLoop } from "./../loop";

export class GameLoop {
    private state: LoopState;

    constructor(
        update: (dt: number) => void,
        render: (alpha: number) => void,
        fixedDelta: number = 1 / 60
    ) {
        this.state = createLoop(update, render, fixedDelta);
    }

    start() {
        startLoop(this.state);
    }

    stop() {
        stopLoop(this.state);
    }

    isRunning(): boolean {
        return this.state.running;
    }
}