## Audio State Manager (Web Audio System)

### Purpose

This module provides a lightweight audio management layer built on the Web Audio API. It handles:
- Audio context lifecycle and user-gesture unlocking
- Loading and caching audio buffers
- Playing sound effects
- Playing and controlling looping music
- Global music volume control

It is designed for browser environments where audio playback must be unlocked via user interaction.

---

### Lifecycle

**Creation → Update → Destruction**

1. **Creation (`createAudioState`)**
   - Instantiates an `AudioContext`
   - Creates a global `GainNode` for music volume control
   - Registers one-time event listeners to unlock audio on first user interaction

2. **Update (runtime usage)**
   - Audio buffers are loaded into memory (`loadAudio`)
   - Sounds or music are played from cached buffers
   - Music can be stopped or volume-adjusted dynamically

3. **Destruction**
   - Not explicitly implemented
   - Would require manual cleanup of:
     - `AudioContext.close()`
     - active nodes (`musicSource`, `musicGain` connections)

---

### Public API

#### `createAudioState(): AudioState`
Initializes and returns the audio system state.

- Creates `AudioContext`
- Sets up `GainNode` for music output
- Registers unlock listeners (click/keydown)
- Initializes buffer cache and playback state

---

#### `loadAudio(state, name, url): Promise<void>`
Loads an audio file and stores it in memory.

- Fetches audio data from URL
- Decodes it into an `AudioBuffer`
- Stores buffer in `state.buffers` under `name`

---

#### `playSound(state, name): void`
Plays a one-shot sound effect.

- Requires audio to be unlocked
- Does not loop
- Bypasses music gain (directly connects to destination)

---

#### `playMusic(state, name, volume?): void`
Plays looping background music.

- Stops any existing music first
- Uses shared `musicGain` node for volume control
- Loops indefinitely
- Stores active source in `state.musicSource`

---

#### `stopMusic(state): void`
Stops currently playing music.

- Stops and disconnects active `AudioBufferSourceNode`
- Clears `musicSource` reference

---

#### `setMusicVolume(state, volume): void`
Adjusts global music volume.

- Updates `GainNode.gain.value`

---

#### `playMusicAfterGesture(state, name, volume?): Promise<void>`
Ensures audio is unlocked before playing music.

- Resumes suspended `AudioContext` if needed
- Marks system as unlocked
- Immediately starts music playback

---

### Internal Behavior

#### Audio Unlocking System
Modern browsers block audio until a user gesture occurs. This module handles it via:

- One-time listeners on:
  - `click`
  - `keydown`
- On first interaction:
  - Resumes `AudioContext` if suspended
  - Sets `state.unlocked = true`
  - Removes event listeners

---

#### Buffer Management
- Audio files are stored in a `Map<string, AudioBuffer>`
- Prevents repeated network fetches and decoding
- Lookup is required before playback

---

#### Music Routing Architecture
Music playback uses a dedicated signal chain:

```
AudioBufferSourceNode → GainNode (musicGain) → AudioContext.destination
```

This allows centralized volume control for music only, without affecting sound effects.

---

#### Sound vs Music Separation

- **playSound**
  - Direct to destination
  - One-shot
  - No global mixing control

- **playMusic**
  - Routed through gain node
  - Looping
  - Single active track enforced

---

### Example

```ts
const audio = createAudioState();

await loadAudio(audio, "click", "/sounds/click.mp3");
await loadAudio(audio, "bgm", "/music/theme.mp3");

// Play sound effect
playSound(audio, "click");

// Start background music
playMusic(audio, "bgm", 0.5);

// Adjust volume later
setMusicVolume(audio, 0.2);

// Stop music
stopMusic(audio);
```

---

### Related Elements

- Web Audio API (`AudioContext`, `AudioBuffer`, `GainNode`)
- Browser autoplay policies (user gesture requirement)
- Audio buffering and decoding pipelines
- Game/audio engine architecture patterns (SFX vs BGM separation)