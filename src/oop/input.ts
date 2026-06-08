import {
    type InputState,
    createInputState,
    attachInput,
    clearPressed,
    isKeyDown,
    isKeyPressed
} from "../input";

export class Input {
    private state: InputState;

    constructor(blockedKeys: string[] = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "e"]) {
        this.state = createInputState(blockedKeys);
        attachInput(this.state);
    }

    isDown(key: string): boolean {
        return isKeyDown(this.state, key);
    }

    isPressed(key: string): boolean {
        return isKeyPressed(this.state, key);
    }

    clearPressed(): void {
        clearPressed(this.state);
    }

    getState(): InputState {
        return this.state;
    }
}