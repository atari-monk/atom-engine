## Menedżer stanu audio (Web Audio System)

### Cel

Ten moduł zapewnia lekką warstwę zarządzania dźwiękiem opartą na Web Audio API. Obsługuje:

* Cykl życia kontekstu audio i odblokowanie poprzez gest użytkownika
* Ładowanie i cache’owanie buforów audio
* Odtwarzanie efektów dźwiękowych
* Odtwarzanie i kontrolowanie zapętlonej muzyki
* Globalną kontrolę głośności muzyki

Jest przeznaczony do środowisk przeglądarkowych, w których odtwarzanie audio musi zostać odblokowane poprzez interakcję użytkownika.

---

### Cykl życia

**Tworzenie → Aktualizacja → Zniszczenie**

1. **Tworzenie (`createAudioState`)**

   * Instancjonuje `AudioContext`
   * Tworzy globalny `GainNode` do kontroli głośności muzyki
   * Rejestruje jednorazowe listenery zdarzeń do odblokowania audio przy pierwszej interakcji użytkownika

2. **Aktualizacja (użycie w czasie działania)**

   * Bufory audio są ładowane do pamięci (`loadAudio`)
   * Dźwięki lub muzyka są odtwarzane z cache’owanych buforów
   * Muzyka może być zatrzymywana lub jej głośność może być dynamicznie zmieniana

3. **Zniszczenie**

   * Niezaimplementowane jawnie
   * Wymagałoby ręcznego czyszczenia:

     * `AudioContext.close()`
     * aktywnych węzłów (`musicSource`, połączenia `musicGain`)

---

### Publiczne API

#### `createAudioState(): AudioState`

Inicjalizuje i zwraca stan systemu audio.

* Tworzy `AudioContext`
* Ustawia `GainNode` dla wyjścia muzyki
* Rejestruje listenery odblokowania (click/keydown)
* Inicjalizuje cache buforów i stan odtwarzania

---

#### `loadAudio(state, name, url): Promise<void>`

Ładuje plik audio i przechowuje go w pamięci.

* Pobiera dane audio z URL
* Dekoduje je do `AudioBuffer`
* Zapisuje bufor w `state.buffers` pod `name`

---

#### `playSound(state, name): void`

Odtwarza jednorazowy efekt dźwiękowy.

* Wymaga odblokowanego audio
* Nie jest zapętlany
* Omija gain muzyki (łączy się bezpośrednio z destination)

---

#### `playMusic(state, name, volume?): void`

Odtwarza zapętloną muzykę tła.

* Zatrzymuje najpierw każdą istniejącą muzykę
* Używa współdzielonego węzła `musicGain` do kontroli głośności
* Zapętla w nieskończoność
* Przechowuje aktywne źródło w `state.musicSource`

---

#### `stopMusic(state): void`

Zatrzymuje aktualnie odtwarzaną muzykę.

* Zatrzymuje i rozłącza aktywny `AudioBufferSourceNode`
* Czyści referencję `musicSource`

---

#### `setMusicVolume(state, volume): void`

Dostosowuje globalną głośność muzyki.

* Aktualizuje `GainNode.gain.value`

---

#### `playMusicAfterGesture(state, name, volume?): Promise<void>`

Zapewnia, że audio jest odblokowane przed odtworzeniem muzyki.

* Wznawia wstrzymany `AudioContext`, jeśli to konieczne
* Oznacza system jako odblokowany
* Natychmiast rozpoczyna odtwarzanie muzyki

---

### Wewnętrzne działanie

#### System odblokowywania audio

Nowoczesne przeglądarki blokują audio do momentu wystąpienia gestu użytkownika. Ten moduł obsługuje to poprzez:

* Jednorazowe listenery na:

  * `click`
  * `keydown`
* Przy pierwszej interakcji:

  * Wznawia `AudioContext`, jeśli jest wstrzymany
  * Ustawia `state.unlocked = true`
  * Usuwa listenery zdarzeń

---

#### Zarządzanie buforami

* Pliki audio są przechowywane w `Map<string, AudioBuffer>`
* Zapobiega wielokrotnym pobraniom sieciowym i dekodowaniu
* Wymagane jest wyszukiwanie przed odtworzeniem

---

#### Architektura routingu muzyki

Odtwarzanie muzyki używa dedykowanego łańcucha sygnału:

```
AudioBufferSourceNode → GainNode (musicGain) → AudioContext.destination
```

Pozwala to na scentralizowaną kontrolę głośności tylko muzyki, bez wpływu na efekty dźwiękowe.

---

#### Separacja dźwięków i muzyki

* **playSound**

  * Bezpośrednio do destination
  * Jednorazowy
  * Brak globalnej kontroli miksu

* **playMusic**

  * Kierowane przez węzeł gain
  * Zapętlane
  * Wymusza pojedynczy aktywny utwór

---

### Przykład

```ts
const audio = createAudioState();

await loadAudio(audio, "click", "/sounds/click.mp3");
await loadAudio(audio, "bgm", "/music/theme.mp3");

// Odtwórz efekt dźwiękowy
playSound(audio, "click");

// Uruchom muzykę tła
playMusic(audio, "bgm", 0.5);

// Dostosuj głośność później
setMusicVolume(audio, 0.2);

// Zatrzymaj muzykę
stopMusic(audio);
```

---

### Powiązane elementy

* Web Audio API (`AudioContext`, `AudioBuffer`, `GainNode`)
* Polityki autoplay w przeglądarkach (wymóg gestu użytkownika)
* Pipeline buforowania i dekodowania audio
* Wzorce architektury silników gier/audio (separacja SFX vs BGM)