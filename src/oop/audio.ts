import {
    type AudioState,
    createAudioState,
    loadAudio,
    playSound,
    playMusic,
    stopMusic,
    setMusicVolume,
    playMusicAfterGesture,
} from "./../audio";

export class Audio {
    private state: AudioState;

    constructor() {
        this.state = createAudioState();
    }

    async load(name: string, url: string) {
        return loadAudio(this.state, name, url);
    }

    play(name: string) {
        playSound(this.state, name);
    }

    playMusic(name: string, volume = 1) {
        playMusic(this.state, name, volume);
    }

    stopMusic() {
        stopMusic(this.state);
    }

    setMusicVolume(volume: number) {
        setMusicVolume(this.state, volume);
    }

    async playMusicAfterGesture(name: string, volume = 1) {
        return playMusicAfterGesture(this.state, name, volume);
    }

    get unlocked() {
        return this.state.unlocked;
    }
}