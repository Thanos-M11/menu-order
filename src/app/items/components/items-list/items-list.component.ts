import { RouterOutlet } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { ItemCardComponent } from '../item-card/item-card.component';
import { Item, Price, Size } from '../../items.interface';
import { ItemsService } from '../../items.service';
import { ItemState } from '../../items.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-items-list',
  imports: [JsonPipe, ItemCardComponent, ItemDetailsComponent, AsyncPipe],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss',
})
export class ItemsListComponent implements OnInit {
  @Input({ required: true }) itemState!: ItemState;
  @Output() selectedItem = new EventEmitter<number>();

  itemSizes: Size[] = [];
  // cardItemPrices: Price[] = [];

  constructor(
    private itemsService: ItemsService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    const itemId = this.itemState.cardState.currentItemId as number;
    this.itemSizes = this.itemState.itemSizes;
  }

  onSelected(itemOption: number) {
    this.selectedItem.emit(itemOption);
  }

  getItemCardPrices(itemId: number): Price[] {
    let cardItemPrices: Price[] = [];
    this.itemsService.getItemCardPrices$(itemId).subscribe({
      next: (prices) => (cardItemPrices = prices),
    });
    return cardItemPrices;
  }
}
