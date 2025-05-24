import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, ItemCardOption, Price } from '../../items.interface';
import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UndoIconComponent } from '../../../shared/components/icons/undo-icon/undo-icon.component';

@Component({
  selector: 'app-item-details',
  imports: [AsyncPipe, JsonPipe, NgFor, FormsModule, UndoIconComponent],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss',
})
export class ItemDetailsComponent implements OnInit {
  @Input({ required: true }) item!: Item;
  @Input({ required: true }) private itemCardMapOptions!: Map<
    string,
    ItemCardOption
  >;
  @Input() isActive!: Boolean;

  itemCardOptions!: { [key: string]: ItemCardOption }[];

  ngOnInit() {
    this.itemCardOptions = Array.from(this.itemCardMapOptions.entries()).map(
      ([key, value]) => ({
        key: value,
      })
    );
    console.log(this.itemCardMapOptions);
  }

  togglePrice() {
    // if (!option.checked) {
    //   option.price = 0;
    // } else {
    //   const initialPrice = this.initialItemCardOptions.find(
    //     (price) =>
    //       price.itemId === option.itemId && price.sizeId === option.sizeId
    //   );
    //   if (initialPrice) {
    //     option.price = initialPrice.price;
    //   }
    // }
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      console.log(form.value);
    }
  }

  undo(form: NgForm) {
    form.resetForm();
  }

  // getTrackIndex = (index: number, item: { itemId: number; sizeId: number }) => {
  //   return `${item.itemId}-${item.sizeId}`;
  // };
}

// todo  update main card state
// todo fix the initialization
// todo fix togglePrice
// todo add custom directives for styling
