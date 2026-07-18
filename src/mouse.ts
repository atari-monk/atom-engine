export type MouseState = {
    x: number;
    y: number;
    leftDown: boolean;
    leftPressed: boolean;
    leftReleased: boolean;
};

export function createMouse(canvas: HTMLCanvasElement): MouseState {
    const mouse: MouseState = {
        x: 0,
        y: 0,
        leftDown: false,
        leftPressed: false,
        leftReleased: false
    };

    canvas.addEventListener("pointermove", (event) => {
        const rect = canvas.getBoundingClientRect();

        mouse.x = (event.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (event.clientY - rect.top) * (canvas.height / rect.height);
    });

    canvas.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
            return;
        }

        const rect = canvas.getBoundingClientRect();

        mouse.x = (event.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (event.clientY - rect.top) * (canvas.height / rect.height);

        if (!mouse.leftDown) {
            mouse.leftPressed = true;
        }

        mouse.leftDown = true;
    });

    window.addEventListener("pointerup", (event) => {
        if (event.button !== 0) {
            return;
        }

        mouse.leftDown = false;
        mouse.leftReleased = true;
    });

    return mouse;
}

export function updateMouse(mouse: MouseState): void {
    mouse.leftPressed = false;
    mouse.leftReleased = false;
}