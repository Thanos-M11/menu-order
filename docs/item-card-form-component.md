# `ItemCardFormComponent` Documentation

## Overview

The `ItemCardFormComponent` is a **form-based Angular component** responsible for:

- Dynamically rendering form controls for an item’s available sizes/options.
- Handling user input for price adjustments and option selection (via checkboxes).
- Storing user selections in `localStorage`.
- Emitting the selected options back to its parent component.

This component leverages **Reactive Forms** and integrates with shared UI components for consistent styling and interaction.

---

## Component Metadata

```ts
@Component({
  selector: 'app-item-card-form',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    CheckboxInputComponent,
    NumberInputComponent,
    UndoIconComponent,
  ],
  templateUrl: './item-card-form.component.html',
  styleUrl: './item-card-form.component.scss',
})
```

---

## Inputs

| Name                 | Type                          | Description                                                      | Required |
| :------------------- | :---------------------------- | :--------------------------------------------------------------- | :------- |
| `item`               | `Item`                        | The item entity associated with this form.                       | ✅       |
| `itemCardMapOptions` | `Map<string, ItemCardOption>` | A map of item card options associated with this item.            | ✅       |
| `isActive`           | `boolean`                     | Determines whether the form is active (to apply active styling). | ❌       |

---

## Outputs

| Name                      | Type                                   | Description                                                        |
| :------------------------ | :------------------------------------- | :----------------------------------------------------------------- |
| `selectedItemCardOptions` | `EventEmitter<StoredItemCardOption[]>` | Emits the updated list of stored item card options when submitted. |

---

## Dependencies (Imports)

- `ReactiveFormsModule`
- `JsonPipe`
- `CheckboxInputComponent`
- `NumberInputComponent`
- `UndoIconComponent`

---

## Class Members

| Name              | Type                     | Description                                    |
| :---------------- | :----------------------- | :--------------------------------------------- |
| `formHasChanged`  | `boolean`                | Tracks if any form value has been modified.    |
| `itemCardOptions` | `StoredItemCardOption[]` | List of options derived from the provided map. |
| `itemForm`        | `FormGroup`              | Reactive form instance managing form controls. |

---

## Lifecycle Hook

- `ngOnInit()`: Initializes the form setup and value change tracking.

---

## Methods

### `onSubmit()`

- Validates form and emits the updated options.
- Persists data to `localStorage` keyed by the item’s `itemId`.

---

### `undo()`

- Clears and resets the form controls to initial state.

---

### `initForm()`

- Initializes form state, reads local storage if available, and sets up value change tracking.

---

### `createSizeGroup()`

- Dynamically generates form controls (`checked` + `price`) for each option.
- Subscribes to `checked` control changes to enable/disable and adjust `price` fields accordingly.

---

### `getLastPriceValue(group: FormGroup): number | null`

- Retrieves the current price value from a given `FormGroup`.

---

### `subscribeToCheckedValueChanges(sizeGroup, lastPrice)`

- Listens for changes to the `checked` control.
- Enables/disables the `price` control and resets its value based on `checked` state.

---

### `initItemForm()`

- Instantiates the `FormGroup` structure with a `FormArray` named `sizes`.

---

### `updateItemCardOptionsFromLocalStorage()`

- Fetches previously stored options for this item from `localStorage` if available.

---

### `getItemCardOptionsFromMap()`

- Converts `itemCardMapOptions` into an array of `StoredItemCardOption` objects.

---

## Template Structure

### Form Structure

- Binds to `itemForm`.
- Uses a `FormArray` named `sizes` to dynamically manage options.

### Looping through Options

For each item option:

- A checkbox (`app-checkbox-input`) for enabling/disabling the option.
- A number input (`app-number-input`) for setting the price.
- Uses `@for` structural directive for efficient rendering.

### Actions

- **Submit button:** Adds selected options.
- **Undo icon:** Appears only when the form has been modified.

---

## Data Flow Summary

- **Inputs:** `item`, `itemCardMapOptions`, `isActive`
- **Form Controls:** `sizes` (FormArray of `FormGroup`s with `checked` and `price`)
- **Event Output:** `selectedItemCardOptions`
- **Persistence:** Local storage under key `item.itemId`

---

[BackTo ReadMe](/README.md)
