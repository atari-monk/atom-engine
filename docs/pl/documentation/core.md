## Interfejsy IUpdatable i IRenderable

### Cel

Te interfejsy definiują minimalny kontrakt dla obiektów uczestniczących w symulacji czasu rzeczywistego lub pętli gry.

* `IUpdatable` oznacza obiekty, które mogą być aktualizowane w czasie.
* `IRenderable` oznacza obiekty, które mogą być rysowane z obsługą interpolacji dla płynnego renderowania.

Są powszechnie używane w silnikach gier, symulacjach lub architekturach typu ECS.

### Cykl życia

Creation → Update → Destruction

1. **Creation**: Obiekty są tworzone i rejestrowane w systemie aktualizacji/renderowania.
2. **Update**: Każda klatka lub tick, wywoływane jest `update(dt)` w celu aktualizacji stanu symulacji.
3. **Render**: Każda klatka, wywoływane jest `render(alpha)` w celu narysowania bieżącego (lub interpolowanego) stanu.
4. **Destruction**: Obiekty są usuwane z systemów i nie są już aktualizowane ani renderowane.

### Publiczne API

#### IUpdatable

* `update(dt: number): void`

  * Aktualizuje wewnętrzny stan obiektu.
  * `dt` oznacza różnicę czasu od ostatniej aktualizacji (zwykle w sekundach).

#### IRenderable

* `render(alpha: number): void`

  * Renderuje obiekt na ekranie lub do docelowego bufora renderowania.
  * `alpha` oznacza współczynnik interpolacji pomiędzy poprzednim a bieżącym stanem (często używany do płynnego renderowania pomiędzy stałymi krokami aktualizacji).

### Wewnętrzne zachowanie

Implementacje zazwyczaj oddzielają logikę symulacji od logiki renderowania:

* `update(dt)` modyfikuje autorytatywny stan (fizyka, AI, logika gry).
* `render(alpha)` używa aktualnego i poprzedniego migawki stanu do interpolacji wyniku wizualnego.
* Parametr `alpha` jest szczególnie przydatny w systemach o stałym kroku czasowym, gdzie renderowanie może odbywać się częściej niż aktualizacje symulacji.

To rozdzielenie pomaga utrzymać deterministyczną symulację przy jednoczesnym zapewnieniu płynnych efektów wizualnych.

### Przykład

```ts
class Player implements IUpdatable, IRenderable {
    position = { x: 0, y: 0 };
    previousPosition = { x: 0, y: 0 };
    velocity = { x: 10, y: 0 };

    update(dt: number): void {
        this.previousPosition = { ...this.position };
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }

    render(alpha: number): void {
        const x = this.previousPosition.x +
            (this.position.x - this.previousPosition.x) * alpha;

        const y = this.previousPosition.y +
            (this.position.y - this.previousPosition.y) * alpha;

        drawCircle(x, y, 10);
    }
}
```

### Powiązane elementy

* Architektura pętli gry (stały krok czasowy + interpolacja)
* Frameworki ECS (Entity-Component-System)
* Systemy symulacji fizyki
* Potoki renderowania z buforowaniem interpolacji
* Delta time (`dt`) i interpolacja klatek (`alpha`)