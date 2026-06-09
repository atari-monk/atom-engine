export interface RenderState {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}

export function createRenderState(canvasId: string): RenderState {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) throw new Error("Canvas not found!");

    const ctx = canvas.getContext("2d")!;
    const state: RenderState = { canvas, ctx };

    resize(state);
    window.addEventListener("resize", () => resize(state));

    return state;
}

export function resize(state: RenderState) {
    const dpr = window.devicePixelRatio || 1;
    state.canvas.width = window.innerWidth * dpr;
    state.canvas.height = window.innerHeight * dpr;
    state.canvas.style.width = window.innerWidth + "px";
    state.canvas.style.height = window.innerHeight + "px";
    state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function clear(state: RenderState) {
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
}

export function drawCircle(state: RenderState, x: number, y: number, radius: number, color: string) {
    state.ctx.fillStyle = color;
    state.ctx.beginPath();
    state.ctx.arc(x, y, radius, 0, Math.PI * 2);
    state.ctx.fill();
}

export function drawRect(state: RenderState, x: number, y: number, width: number, height: number, color: string) {
    state.ctx.fillStyle = color;
    state.ctx.fillRect(x, y, width, height);
}

export function drawLine(state: RenderState, x1: number, y1: number, x2: number, y2: number, color: string, lineWidth = 1) {
    state.ctx.strokeStyle = color;
    state.ctx.lineWidth = lineWidth;
    state.ctx.beginPath();
    state.ctx.moveTo(x1, y1);
    state.ctx.lineTo(x2, y2);
    state.ctx.stroke();
}

export function drawText(state: RenderState, text: string, x: number, y: number, color: string, font = "16px sans-serif") {
    state.ctx.fillStyle = color;
    state.ctx.font = font;
    state.ctx.fillText(text, x, y);
}