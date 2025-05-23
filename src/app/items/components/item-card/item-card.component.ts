import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Item } from '../../items.interface';

@Component({
  selector: 'app-item-card',
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  @Input({ required: true }) item!: Item;
  @Output() selectedItem = new EventEmitter<number>();

  onSelected() {
    this.selectedItem.emit(this.item.itemId);
  }
}
