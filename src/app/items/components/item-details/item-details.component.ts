import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, ItemCardOption } from '../../items.interface';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UndoIconComponent } from '../../../shared/components/icons/undo-icon/undo-icon.component';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { CheckboxInputComponent } from '../../../shared/components/checkbox-input/checkbox-input.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-item-details',
  imports: [
    FormsModule,
    UndoIconComponent,
    NumberInputComponent,
    CheckboxInputComponent,
  ],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',
})
export class ItemDetailsComponent implements OnInit {
  @Input({ required: true }) item!: Item;
  @Input({ required: true }) itemCardMapOptions!: Map<string, ItemCardOption>;
  @Input() isActive!: Boolean;
  @Output() selectedItemCardOptions = new EventEmitter<
    { key: string; value: ItemCardOption }[]
  >();

  itemCardOptions!: { key: string; value: ItemCardOption }[];
  itemCardOptionsInitial!: { key: string; value: ItemCardOption }[];

  ngOnInit() {
    this.itemCardOptions = Array.from(this.itemCardMapOptions.entries()).map(
      ([key, value]) => ({
        key,
        value,
      })
    );

    this.itemCardOptionsInitial = this.getClonedItemCardOptions(
      this.itemCardOptions
    );

    const storedItemCardOptions = localStorage.getItem(
      this.item.itemId.toString()
    );
    if (storedItemCardOptions) {
      const parsedItemCardOptions = JSON.parse(storedItemCardOptions);
      this.itemCardOptions = parsedItemCardOptions;
    }
  }

  togglePrice(enteredOption: { key: string; value: ItemCardOption }) {
    if (!enteredOption.value.checked) {
      enteredOption.value.price = 0;
    } else {
      const initialOption = this.itemCardOptionsInitial.find(
        (option) => option.key === enteredOption.key
      );

      if (initialOption) {
        enteredOption.value.price = initialOption.value.price;
      }
    }
  }

  submitForm(form: NgForm): void {
    if (form.valid) {
      localStorage.setItem(
        this.item.itemId.toString(),
        JSON.stringify(this.itemCardOptions)
      );
      this.selectedItemCardOptions.emit(this.itemCardOptions);
    }
  }

  undo(form: NgForm): void {
    this.itemCardOptions = this.getClonedItemCardOptions(
      this.itemCardOptionsInitial
    );

    // todo
    form.resetForm(this.itemCardOptions);
  }

  getClonedItemCardOptions(options: { key: string; value: ItemCardOption }[]): {
    key: string;
    value: ItemCardOption;
  }[] {
    return JSON.parse(JSON.stringify(options));
  }
}
