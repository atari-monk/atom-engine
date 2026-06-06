export interface IUpdatable {
    update(dt: number): void;
}

export interface IRenderable {
    render(alpha: number): void;
}