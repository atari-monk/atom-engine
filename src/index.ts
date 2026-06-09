export { IUpdatable, IRenderable } from "./core"

export { type LoopState, createLoop, startLoop, stopLoop } from "./loop"
export { type RenderState, createRenderState, resize, clear, drawCircle, drawRect, drawLine, drawText } from './renderer'
export { type InputState, createInputState, attachInput, isKeyDown } from "./input"
export { type AudioState, createAudioState, loadAudio, playSound, playMusic, stopMusic, setMusicVolume, playMusicAfterGesture } from './audio'

export { GameLoop } from "./oop/loop";
export { Renderer } from "./oop/renderer";
export { Input } from "./oop/input";
export { Audio } from "./oop/audio";