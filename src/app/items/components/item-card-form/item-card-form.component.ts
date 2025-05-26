import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Item,
  ItemCardOption,
  StoredItemCardOption,
} from '../../items.interface';
import { JsonPipe } from '@angular/common';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { UndoIconComponent } from '../../../shared/components/icons/undo-icon/undo-icon.component';

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
export class ItemCardFormComponent implements OnInit {
  @Input({ required: true }) item!: Item;
  @Input({ required: true }) itemCardMapOptions!: Map<string, ItemCardOption>;
  @Input() isActive!: Boolean;
  @Output() selectedItemCardOptions = new EventEmitter<
    StoredItemCardOption[]
  >();

  formHasChanged = false;
  itemCardOptions!: StoredItemCardOption[];

  itemForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.initForm();
    // this.itemCardOptionsInitial = this.getClonedItemCardOptions();
  }

  private initForm() {
    this.itemCardOptions = this.getItemCardOptionsFromMap();
    this.updateItemCardOptionsFromLocalStorage();
    this.initItemForm();
    this.createSizeGroup();
    this.itemForm.valueChanges.subscribe(() => (this.formHasChanged = true));
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const enteredItemCardOptions = this.itemForm.get('sizes')?.value;

      const storedData: StoredItemCardOption[] = this.itemCardOptions.map(
        (option, index) => {
          return {
            key: option.key,
            value: {
              ...option.value,
              price: enteredItemCardOptions[index].price,
              checked: enteredItemCardOptions[index].checked,
            },
          };
        }
      );

      localStorage.setItem(
        this.item.itemId.toString(),
        JSON.stringify(storedData)
      );
      this.selectedItemCardOptions.emit(storedData);
    }
  }

  undo(): void {
    const sizeArray = this.itemForm.get('sizes') as FormArray;
    sizeArray.clear();
    this.initForm();
  }

  private createSizeGroup() {
    const sizeArray = this.itemForm.get('sizes') as FormArray;

    this.itemCardOptions.forEach((size) => {
      const sizeGroup = new FormGroup({
        checked: new FormControl<boolean>(true),
        price: new FormControl<number | null>({
          value: size.value.price,
          disabled: false,
        }),
      });

      const lastPriceValue: number | null = this.getLastPriceValue(sizeGroup);

      this.subscribeToCheckedValueChanges(sizeGroup, lastPriceValue);

      // push group
      sizeArray.push(sizeGroup);
    });
  }

  private getLastPriceValue(group: FormGroup): number | null {
    return group.get('price')?.value ?? null;
  }

  private subscribeToCheckedValueChanges(
    sizeGroup: FormGroup,
    lastPrice: number | null
  ) {
    sizeGroup.get('checked')?.valueChanges.subscribe({
      next: (isChecked) => {
        const priceControl = sizeGroup.get('price');
        if (isChecked) {
          priceControl?.enable();
          priceControl?.setValue(lastPrice, { emitEvent: false });
        } else {
          priceControl?.disable();
          priceControl?.setValue(0, { emitEvent: false });
        }
      },
    });
  }

  private initItemForm(): void {
    this.itemForm = new FormGroup({
      sizes: new FormArray([]),
    });
  }

  private updateItemCardOptionsFromLocalStorage(): void {
    const storedItemCardOptions = localStorage.getItem(
      this.item.itemId.toString()
    );
    if (storedItemCardOptions) {
      const parsedItemCardOptions = JSON.parse(storedItemCardOptions);
      this.itemCardOptions = parsedItemCardOptions;
    }
  }

  private getItemCardOptionsFromMap(): StoredItemCardOption[] {
    return Array.from(this.itemCardMapOptions.entries()).map(
      ([key, value]) => ({
        key,
        value,
      })
    );
  }
}
