## Audio

### Purpose

Klasa `Audio` jest wysokopoziomowym wrapperem wokół niższopoziomowego systemu audio. Zarządza wewnętrznym stanem audio i zapewnia uproszczony interfejs do ładowania i kontrolowania efektów dźwiękowych oraz odtwarzania muzyki. Abstrahuje wymagania dotyczące odblokowania gestem oraz zarządzanie stanem, ułatwiając operacje audio w kodzie aplikacji.

---

### Lifecycle

Creation → Update → Destruction

* **Creation**: Instancja `Audio` inicjalizuje nowy `AudioState` za pomocą `createAudioState()`.
* **Update**: Zasoby audio są ładowane i odtwarzane za pomocą metod, które modyfikują lub wykorzystują stan wewnętrzny.
* **Destruction**: Nie zaimplementowano jawnego czyszczenia; zakłada się, że sprzątanie jest obsługiwane przez bazowy system audio lub garbage collection.

---

### Public API

* **constructor()**

  * Inicjalizuje nowy wewnętrzny `AudioState`.

* **async load(name: string, url: string): Promise<unknown>**

  * Ładuje zasób audio do pamięci lub systemu audio.

* **play(name: string): void**

  * Odtwarza krótki efekt dźwiękowy identyfikowany przez `name`.

* **playMusic(name: string, volume = 1): void**

  * Rozpoczyna zapętlone lub tło odtwarzanie muzyki z opcjonalną głośnością.

* **stopMusic(): void**

  * Zatrzymuje aktualnie odtwarzaną muzykę.

* **setMusicVolume(volume: number): void**

  * Dostosowuje globalną lub bieżącą głośność muzyki.

* **async playMusicAfterGesture(name: string, volume = 1): Promise<unknown>**

  * Opóźnia odtwarzanie muzyki do momentu wystąpienia wymaganego interakcji użytkownika (gestu).

* **get unlocked: boolean**

  * Wskazuje, czy system audio został odblokowany do odtwarzania (np. po geście użytkownika w przeglądarkach).

---

### Internal Behavior

* Klasa utrzymuje prywatną instancję `AudioState`, która przechowuje wszystkie dane audio w czasie wykonania oraz flagi takie jak `unlocked`.
* Wszystkie operacje delegowane są do funkcji importowanych z `./../audio`, które wykonują właściwe przetwarzanie audio i przejścia stanu.
* Odtwarzanie oparte na geście (`playMusicAfterGesture`) prawdopodobnie kolejkowuje lub opóźnia odtwarzanie do momentu, gdy przeglądarka zezwoli na wyjście audio.
* Getter `unlocked` ujawnia, czy system spełnił wymagania interakcji użytkownika dla odtwarzania audio.

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

* `AudioState` – Wewnętrzna struktura stanu zarządzająca statusem odtwarzania i stanem odblokowania.
* `createAudioState` – Inicjalizuje stan systemu audio.
* `loadAudio` – Ładuje zasoby audio do systemu.
* `playSound` – Odtwarza krótkie efekty dźwiękowe.
* `playMusic` – Rozpoczyna odtwarzanie muzyki w tle lub w pętli.
* `stopMusic` – Zatrzymuje odtwarzanie muzyki.
* `setMusicVolume` – Kontroluje głośność muzyki.
* `playMusicAfterGesture` – Obsługuje ograniczenia przeglądarki dotyczące gestów dla automatycznego odtwarzania audio.