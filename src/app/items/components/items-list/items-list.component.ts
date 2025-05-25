import { JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { ItemCardComponent } from '../item-card/item-card.component';
import { KeyboardArrowDownComponent } from '../../../shared/components/icons/keyboard-arrow-down/keyboard-arrow-down.component';
import { KeyboardArrowUpComponent } from '../../../shared/components/icons/keyboard-arrow-up/keyboard-arrow-up.component';
import { ItemCardOption, ItemState } from '../../items.interface';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-items-list',
  imports: [
    JsonPipe,
    ItemCardComponent,
    ItemDetailsComponent,
    KeyboardArrowDownComponent,
    KeyboardArrowUpComponent,
    CardComponent,
  ],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
})
export class ItemsListComponent implements OnInit {
  @Input({ required: true }) state!: ItemState;
  @Output() selectedItem = new EventEmitter<number>();
  @Output() selectedItemCardOptions = new EventEmitter<
    { key: string; value: ItemCardOption }[]
  >();

  constructor() {}

  ngOnInit() {
    console.log(this.state.items);
  }

  onSelected(itemOption: number) {
    this.selectedItem.emit(itemOption);
  }

  onSelectedItemCardOptions(options: { key: string; value: ItemCardOption }[]) {
    this.selectedItemCardOptions.emit(options);
  }

  getFilteredItemCardMap(itemId: number): Map<string, ItemCardOption> {
    return new Map(
      Array.from(this.state.itemCardOptions.entries()).filter(([key, _]) =>
        key.startsWith(`${itemId}-`)
      )
    );
  }
}
