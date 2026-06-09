export type AudioState = {
    context: AudioContext;
    buffers: Map<string, AudioBuffer>;
    unlocked: boolean;
    musicSource: AudioBufferSourceNode | null;
    musicGain: GainNode;
};

export function createAudioState(): AudioState {
    const context = new AudioContext();
    const musicGain = context.createGain();
    musicGain.connect(context.destination);

    const state: AudioState = {
        context,
        buffers: new Map(),
        unlocked: false,
        musicSource: null,
        musicGain,
    };

    const unlock = async () => {
        if (state.context.state === "suspended") {
            await state.context.resume();
        }
        state.unlocked = true;
        window.removeEventListener("click", unlock);
        window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return state;
}

export async function loadAudio(
    state: AudioState,
    name: string,
    url: string
) {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await state.context.decodeAudioData(arrayBuffer);
    state.buffers.set(name, audioBuffer);
}

export function playSound(state: AudioState, name: string) {
    if (!state.unlocked) return;

    const buffer = state.buffers.get(name);
    if (!buffer) return;

    const source = state.context.createBufferSource();
    source.buffer = buffer;
    source.connect(state.context.destination);
    source.start();
}

export function playMusic(
    state: AudioState,
    name: string,
    volume = 1
) {
    if (!state.unlocked) return;

    const buffer = state.buffers.get(name);
    if (!buffer) return;

    stopMusic(state);

    state.musicGain.gain.value = volume;

    const source = state.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(state.musicGain);
    source.start();

    state.musicSource = source;
}

export function stopMusic(state: AudioState) {
    if (!state.musicSource) return;

    state.musicSource.stop();
    state.musicSource.disconnect();
    state.musicSource = null;
}

export function setMusicVolume(
    state: AudioState,
    volume: number
) {
    state.musicGain.gain.value = volume;
}

export async function playMusicAfterGesture(
    state: AudioState,
    name: string,
    volume = 1
) {
    if (state.context.state === "suspended") {
        await state.context.resume();
    }

    state.unlocked = true;
    playMusic(state, name, volume);
}