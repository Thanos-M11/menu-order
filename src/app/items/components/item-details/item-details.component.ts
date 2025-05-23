import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, Price, Size } from '../../items.interface';
import { CardState, ItemCardOption } from '../../items.state';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { Form, FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-item-details',
  imports: [AsyncPipe, JsonPipe, NgFor, FormsModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',
})
export class ItemDetailsComponent implements OnInit {
  @Input({ required: true }) item!: Item;
  @Input() cardState!: CardState;
  @Input() itemCardPrices!: Price[];
  @Output() selectedItemCardOptions = new EventEmitter<ItemCardOption[]>();

  initialItemCardOptions: ItemCardOption[] = [];
  itemCardOptions: ItemCardOption[] = [];

  ngOnInit() {
    this.initialItemCardOptions = this.cardState.currentItemCardOptions.map(
      (option) => ({
        ...option,
      })
    );
    this.itemCardOptions = this.itemCardPrices.map((price) => ({
      ...price,
      checked: true,
    }));
  }

  togglePrice(option: ItemCardOption) {
    if (!option.checked) {
      option.price = 0;
    } else {
      const initialPrice = this.initialItemCardOptions.find(
        (price) =>
          price.itemId === option.itemId && price.sizeId === option.sizeId
      );
      if (initialPrice) {
        option.price = initialPrice.price;
      }
    }
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
    }
  }

  undo(form: NgForm) {
    form.resetForm();
  }

  getTrackIndex = (index: number, item: { itemId: number; sizeId: number }) => {
    return `${item.itemId}-${item.sizeId}`;
  };
}
