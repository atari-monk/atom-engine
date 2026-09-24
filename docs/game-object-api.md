## GameObject API

- Struct with state
- Functions create, update, render

```ts
export type State = {
  //props
};

export function create(): State {
  //args
  return {
    //initialization
  };
}

export function update(obj: State, dt: number): void {}

export function render(obj: State, ctx: CanvasRenderingContext2D): void {}
```
