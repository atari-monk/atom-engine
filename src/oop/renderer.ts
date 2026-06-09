import { type RenderState, createRenderState, resize, clear, drawCircle, drawRect, drawLine, drawText } from "../renderer";

export class Renderer {
    private state: RenderState;

    constructor(canvasId: string) {
        this.state = createRenderState(canvasId);
    }

    resize() {
        resize(this.state);
    }

    clear() {
        clear(this.state);
    }

    drawCircle(x: number, y: number, radius: number, color: string) {
        drawCircle(this.state, x, y, radius, color);
    }

    drawRect(x: number, y: number, width: number, height: number, color: string) {
        drawRect(this.state, x, y, width, height, color);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: string, lineWidth = 1) {
        drawLine(this.state, x1, y1, x2, y2, color, lineWidth);
    }

    drawText(text: string, x: number, y: number, color: string, font?: string) {
        drawText(this.state, text, x, y, color, font);
    }

    get ctx() {
        return this.state.ctx;
    }

    get canvas() {
        return this.state.canvas;
    }
}