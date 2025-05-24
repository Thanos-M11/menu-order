import { ItemsService } from './../../items.service';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsListComponent } from '../../components/items-list/items-list.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ItemCardOption, ItemState } from '../../items.interface';
import { filter } from 'rxjs';

@Component({
  selector: 'app-items-container',
  imports: [ItemsListComponent, JsonPipe, AsyncPipe],
  templateUrl: './items-container.component.html',
  styleUrl: './items-container.component.scss',
})
export class ItemsContainerComponent implements OnInit {
  state!: ItemState;

  constructor(
    private activatedRoute: ActivatedRoute,
    private itemsService: ItemsService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.itemsService
      .getRouteParams$(this.activatedRoute, this.destroyRef)
      .subscribe((params) => {
        this.itemsService.setCurrentItemId(+params['id']);
      });

    this.itemsService.loadState();
    this.itemsService.state$
      .pipe(
        filter(
          (state) =>
            state.items.length > 0 &&
            state.itemPrices.length > 0 &&
            state.itemSizes.length > 0 &&
            state.itemCardOptions.size > 0
        )
      )
      .subscribe((state) => {
        this.state = state;
        console.log(state.itemCardOptions);
      });
  }

  handleSelectedItem(itemId: number) {
    this.itemsService.setCurrentItemId(itemId);
    this.itemsService.navigateTo([itemId.toString()], this.activatedRoute);
  }

  // only for testing Map in the DOM
  getItemCardOptionsMap(): ItemCardOption[] {
    return Array.from(this.state?.itemCardOptions.values() || []);
  }
}
