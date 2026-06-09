export { type LoopState, createLoop, startLoop, stopLoop } from "./loop"
export { type InputState, createInputState, attachInput, isKeyDown } from "./input"
export { type RenderState, createRenderState, resize, clear, drawCircle, drawRect, drawLine, drawText } from './renderer'

export { IUpdatable, IRenderable } from "./core"

export { GameLoop } from "./oop/loop";
export { Input } from "./oop/input";
export { Renderer } from "./oop/renderer";