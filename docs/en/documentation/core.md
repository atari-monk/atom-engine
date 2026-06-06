## IUpdatable and IRenderable Interfaces

### Purpose

These interfaces define a minimal contract for objects participating in a real-time simulation or game loop.

- `IUpdatable` marks objects that can be advanced over time.
- `IRenderable` marks objects that can be drawn with interpolation support for smooth rendering.

They are commonly used in game engines, simulations, or ECS-style architectures.

### Lifecycle

Creation → Update → Destruction

1. **Creation**: Objects are instantiated and registered with the update/render system.
2. **Update**: Each frame or tick, `update(dt)` is called to advance simulation state.
3. **Render**: Each frame, `render(alpha)` is called to draw the current (or interpolated) state.
4. **Destruction**: Objects are removed from systems and no longer updated or rendered.

### Public API

#### IUpdatable

- `update(dt: number): void`
  - Advances the internal state of the object.
  - `dt` represents the time delta since the last update (usually in seconds).

#### IRenderable

- `render(alpha: number): void`
  - Renders the object to the screen or render target.
  - `alpha` represents an interpolation factor between the previous and current state (commonly used for smooth rendering between fixed update steps).

### Internal Behavior

Implementations typically separate simulation logic from rendering logic:

- `update(dt)` modifies the authoritative state (physics, AI, game logic).
- `render(alpha)` uses current and previous state snapshots to interpolate visual output.
- The `alpha` parameter is especially useful in fixed-timestep systems, where rendering may occur more frequently than simulation updates.

This separation helps maintain deterministic simulation while ensuring smooth visuals.

### Example

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

### Related Elements

- Game loop architecture (fixed timestep + interpolation)
- Entity-Component-System (ECS) frameworks
- Physics simulation systems
- Rendering pipelines with interpolation buffering
- Delta time (`dt`) and frame interpolation (`alpha`)