# ItemsContainerComponent Documentation

An Angular container component responsible for:

- Subscribing to the `ItemsService` state
- Handling route parameters for item selection
- Delegating item and item card option interactions
- Passing state and event bindings to its child presentation component (`ItemsListComponent`)

---

## Component Overview

| Feature                       | Description                                                           |
| :---------------------------- | :-------------------------------------------------------------------- |
| Acts as a container component | Orchestrates state and event handling for the items list presentation |
| State Source                  | Subscribes to `ItemsService.state$` observable                        |
| Route Handling                | Listens to route parameters and updates current item selection        |
| Child Component               | `<app-items-list>` for presenting items                               |
| Template Features             | Pizza header, item list, event bindings                               |

---

## Class: `ItemsContainerComponent`

### Decorator

```ts
@Component({
  selector: 'app-items-container',
  imports: [ItemsListComponent, JsonPipe, AsyncPipe],
  templateUrl: './items-container.component.html',
  styleUrl: './items-container.component.scss',
})
```

---

## Properties

| Name    | Type                   | Description                                         |
| :------ | :--------------------- | :-------------------------------------------------- |
| `state` | `ItemState` (inferred) | Holds the current state emitted from `ItemsService` |

---

## Lifecycle Hook

### `ngOnInit()`

- Subscribes to route parameters via `ItemsService.getRouteParams$()`
- Updates current selected item via `ItemsService.setCurrentItemId()`
- Loads the initial application state via `ItemsService.loadState()`
- Subscribes to the service’s `state$` observable and updates local `state`

---

## Private Methods

### `subscribeToState(): void`

Subscribes to `ItemsService.state$` and assigns the emitted value to the component’s local `state` property. Automatically unsubscribes on destroy using `DestroyRef.onDestroy()`.

---

## Event Handlers

### `handleSelectedItem(itemId: number): void`

- Toggles selection of an item.
- If the selected item is already active, deselects it and navigates back.
- Otherwise, sets it as active and navigates to its route.

**Navigation:** Uses relative navigation via `ItemsService.navigateTo()`.

---

### `handleSelectedItemCardOptions(options: { key: string; value: ItemCardOption }[]): void`

Handles user interaction with item card options emitted from the list component. Currently logs the values. A placeholder for future service method integration or action dispatching.

---

## Template Overview (HTML)

```html
<div class="container">
  <header>
    <h2>Pizza</h2>
  </header>
  <app-items-list [state]="state" (selectedItem)="handleSelectedItem($event)" (selectedItemCardOptions)="handleSelectedItemCardOptions($event)"></app-items-list>
</div>
```

---

## Dependencies

- `ItemsService`
- `ItemsListComponent`
- `ActivatedRoute`
- `DestroyRef`

---

## Example Usage

```html
<app-items-container></app-items-container>
```

---

[BackTo ReadMe](/README.md)
