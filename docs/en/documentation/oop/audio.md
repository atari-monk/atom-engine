## Audio

### Purpose

The `Audio` class is a high-level wrapper around a lower-level audio system. It manages an internal audio state and provides a simplified interface for loading and controlling sound effects and music playback. It abstracts gesture-unlocking requirements and state management, making audio operations easier to use in application code.

---

### Lifecycle

Creation → Update → Destruction

- **Creation**: An `Audio` instance initializes a new `AudioState` via `createAudioState()`.
- **Update**: Audio assets are loaded and played through methods that mutate or use the internal state.
- **Destruction**: No explicit teardown is implemented; cleanup is assumed to be handled by the underlying audio system or garbage collection.

---

### Public API

- **constructor()**
  - Initializes a new internal `AudioState`.

- **async load(name: string, url: string): Promise<unknown>**
  - Loads an audio asset into memory or the audio system.

- **play(name: string): void**
  - Plays a short sound effect identified by `name`.

- **playMusic(name: string, volume = 1): void**
  - Starts looping or background music playback with an optional volume.

- **stopMusic(): void**
  - Stops currently playing music.

- **setMusicVolume(volume: number): void**
  - Adjusts the global or current music volume.

- **async playMusicAfterGesture(name: string, volume = 1): Promise<unknown>**
  - Defers music playback until a required user interaction (gesture) has occurred.

- **get unlocked: boolean**
  - Indicates whether the audio system has been unlocked for playback (e.g., after a user gesture in browsers).

---

### Internal Behavior

- The class maintains a private `AudioState` instance, which stores all runtime audio data and flags such as `unlocked`.
- All operations delegate to functions imported from `./../audio`, which perform the actual audio processing and state transitions.
- Gesture-based playback (`playMusicAfterGesture`) likely queues or delays playback until the browser allows audio output.
- The `unlocked` getter exposes whether the system has satisfied user interaction requirements for audio playback.

---

### Example

```ts
const audio = new Audio();

// Load assets
await audio.load("bgm", "/audio/bgm.mp3");
await audio.load("click", "/audio/click.wav");

// Play sound effect
audio.play("click");

// Start background music
audio.playMusic("bgm", 0.5);

// Adjust volume
audio.setMusicVolume(0.8);

// Stop music
audio.stopMusic();

// Handle autoplay restrictions
await audio.playMusicAfterGesture("bgm", 0.5);

console.log(audio.unlocked);
```

---

### Related Elements

- `AudioState` – Internal state structure managing playback status and unlock state.
- `createAudioState` – Initializes the audio system state.
- `loadAudio` – Loads audio resources into the system.
- `playSound` – Plays short sound effects.
- `playMusic` – Starts background or looping music playback.
- `stopMusic` – Stops music playback.
- `setMusicVolume` – Controls music volume.
- `playMusicAfterGesture` – Handles browser gesture restrictions for autoplay audio.