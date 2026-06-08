export type InputState = {
    keys: Set<string>;
    pressed: Set<string>;
    blockedKeys: Set<string>;
};

export function createInputState(blockedKeys: string[] = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "e"]): InputState {
    return {
        keys: new Set(),
        pressed: new Set(),
        blockedKeys: new Set(blockedKeys)
    };
}

export function attachInput(state: InputState) {
    window.addEventListener("keydown", (e) => {
        const key = e.key;

        if (!e.repeat) {
            state.pressed.add(key);
        }

        state.keys.add(key);

        if (state.blockedKeys.has(key)) {
            e.preventDefault();
        }
    });

    window.addEventListener("keyup", (e) => {
        state.keys.delete(e.key);

        if (state.blockedKeys.has(e.key)) {
            e.preventDefault();
        }
    });
}

export function clearPressed(state: InputState) {
    state.pressed.clear();
}

export function isKeyDown(state: InputState, key: string) {
    return state.keys.has(key);
}

export function isKeyPressed(state: InputState, key: string) {
    return state.pressed.has(key);
}