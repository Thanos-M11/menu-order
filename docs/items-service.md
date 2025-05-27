# ItemsService Documentation

A TypeScript service in Angular responsible for managing item-related data and reactive state using **RxJS** and **HttpClient**. It provides observable streams for application state, handles HTTP data loading, and exposes utility functions for navigation and route parameter access.

---

## Service Overview

| Feature                   | Description                                                  |
| :------------------------ | :----------------------------------------------------------- |
| Data Source               | Loads from a local JSON file (`assets/json/data.json`)       |
| Reactive State Management | Uses `BehaviorSubject` and `combineLatest` to maintain state |
| Error Handling            | Custom reusable RxJS `catchError` operator for HTTP errors   |
| Public State Observable   | `state$` emits combined app state with `shareReplay(1)`      |
| Navigation Utility        | Programmatic navigation via Angular `Router`                 |

---

## Class: `ItemsService`

### Constructor

```ts
constructor(private http: HttpClient, private router: Router)
```

---

## Properties

| Name     | Type                    | Description                                              |
| :------- | :---------------------- | :------------------------------------------------------- |
| `URL`    | `string`                | Path to JSON data source                                 |
| `state$` | `Observable<ItemState>` | Emits combined state of items, prices, sizes, error etc. |

---

## State Management Subjects (private)

- `itemsSubject: BehaviorSubject<Item[]>`
- `itemPricesSubject: BehaviorSubject<Price[]>`
- `itemSizesSubject: BehaviorSubject<Size[]>`
- `loadingSubject: BehaviorSubject<boolean>`
- `errorSubject: BehaviorSubject<string | null>`
- `selectedItemIdSubject: BehaviorSubject<number | null>`
- `itemCardOptionsMapSubject: BehaviorSubject<Map<string, ItemCardOption>>`

---

## Public Methods

### `setCurrentItemId(itemId: number | null): void`

Sets the current selected item ID.

---

### `navigateTo(path: string[], route?: ActivatedRoute): void`

Navigates to a given path, optionally relative to a route.

---

### `getRouteParams$(activatedRoute: ActivatedRoute, destroyRef: DestroyRef): Observable<Params>`

Gets route parameters from the first child of an activated route. Completes when `destroyRef` triggers.

---

### `loadState(): void`

Fetches items, prices, and sizes in parallel via `forkJoin`, updating internal state subjects. Handles errors gracefully via a reusable error handler.

---

## Private Methods

### `readItems$(): Observable<Item[]>`

Loads item data or returns cached values if already loaded.

---

### `readPrices$(): Observable<Price[]>`

Loads price data or returns cached values if already loaded.

---

### `readSizes$(): Observable<Size[]>`

Loads size data or returns cached values if already loaded.

---

### `getItemCardOptionsMap(prices: Price[], sizes: Size[]): Map<string, ItemCardOption>`

Creates a mapping between combined `itemId` and `sizeId` to their respective display options.

---

### `handleHttpError<T>(message: string): MonoTypeOperatorFunction<T>`

A reusable RxJS operator for catching HTTP errors, logging them, and rethrowing with a custom error message.

---

## State Structure — `ItemState`

```ts
interface ItemState {
  items: Item[];
  itemPrices: Price[];
  itemSizes: Size[];
  loading: boolean;
  error: string | null;
  selectedItemId: number | null;
  itemCardOptionsMap: Map<string, ItemCardOption>;
}
```

---

## Example Usage

```ts
itemsService.loadState();
itemsService.state$.subscribe((state) => console.log(state.items));
itemsService.setCurrentItemId(1);
```

---

## Notes

- Uses `shareReplay(1)` to replay the latest emitted value to new subscribers.
- All state observables are derived from `BehaviorSubjects` for immediate current state access.
- Error handling is centralized via `handleHttpError` for consistent logging and error propagation.


---
[BackTo ReadMe](/README.md)