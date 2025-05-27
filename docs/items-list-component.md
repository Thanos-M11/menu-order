# `ItemsListComponent` Documentation

## Overview

The `ItemsListComponent` is a **presentational Angular component** responsible for:

- Rendering a list of items.
- Displaying individual `ItemCardComponent` instances.
- Toggling item details through a form (`ItemCardFormComponent`) on item selection.
- Emitting events for item selection and item card option selections to its container.

This component integrates a few shared UI components like `CardComponent` and icon components for a cohesive UI.

---

## Component Metadata

```ts
@Component({
  selector: 'app-items-list',
  imports: [
    JsonPipe,
    ItemCardComponent,
    ItemCardFormComponent,
    KeyboardArrowDownComponent,
    KeyboardArrowUpComponent,
    CardComponent,
  ],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
})
```

---

## Inputs

| Name    | Type        | Description                                                                                          | Required |
| :------ | :---------- | :--------------------------------------------------------------------------------------------------- | :------- |
| `state` | `ItemState` | The application state for the items list, containing items, prices, sizes, and UI state information. | ✅       |

---

## Outputs

| Name                      | Type                                                     | Description                                                                   |
| :------------------------ | :------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `selectedItem`            | `EventEmitter<number>`                                   | Emits the `itemId` when an item card is selected.                             |
| `selectedItemCardOptions` | `EventEmitter<{ key: string; value: ItemCardOption }[]>` | Emits when item card options are selected within the `ItemCardFormComponent`. |

---

## Dependencies (Imports)

- `ItemCardComponent`
- `ItemCardFormComponent`
- `KeyboardArrowDownComponent`
- `KeyboardArrowUpComponent`
- `CardComponent`
- `JsonPipe`

---

## Class Members

### `getFilteredItemCardMap(itemId: number): Map<string, ItemCardOption>`

Returns a filtered map of `ItemCardOption` instances related to a given `itemId`.

**Example:**

```ts
getFilteredItemCardMap(3);
```

Returns all card options whose key starts with `3-`.

---

## Methods

| Name                                                                           | Parameters                                   | Description |
| :----------------------------------------------------------------------------- | :------------------------------------------- | :---------- |
| `onSelected(itemId: number)`                                                   | Emits the selected item's ID.                |             |
| `onSelectedItemCardOptions(options: { key: string; value: ItemCardOption }[])` | Emits the selected options for an item card. |             |

---

## Template Structure

Renders a list of items using Angular’s `@for` structural directive.

For each item:

- Renders a `CardComponent`.
- Displays an up/down icon based on whether the item is selected.
- Renders an `ItemCardComponent`.
- Conditionally shows an `ItemCardFormComponent` when the item is selected, passing filtered item card options.

---

## Data Flow Summary

- **Input:** `state` from container.
- **Event Outputs:** `selectedItem`, `selectedItemCardOptions`
- **Display Components:**
  `ItemCardComponent`, `ItemCardFormComponent`, `KeyboardArrowUpComponent`, `KeyboardArrowDownComponent`, `CardComponent`




---

[BackTo ReadMe](/README.md)
