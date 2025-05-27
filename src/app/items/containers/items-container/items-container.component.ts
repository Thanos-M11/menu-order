import { ItemsService } from './../../items.service';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemsListComponent } from '../../components/items-list/items-list.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ItemCardOption, ItemState } from '../../items.interface';

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
    this.subscribeToState();
  }

  private subscribeToState(): void {
    const subscription = this.itemsService.state$.subscribe({
      next: (loadedState) => (this.state = loadedState),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  handleSelectedItem(itemId: number) {
    if (itemId === this.state.selectedItemId) {
      this.itemsService.setCurrentItemId(null);
      this.itemsService.navigateTo(['./'], this.activatedRoute);
    } else {
      this.itemsService.setCurrentItemId(itemId);
      this.itemsService.navigateTo([itemId.toString()], this.activatedRoute);
    }
  }

  handleSelectedItemCardOptions(
    options: { key: string; value: ItemCardOption }[]
  ): void {
    console.log('Handle Selected Item Card Option', options);
    // set a service to handle this per user !!!
    // dispatch action in the service
    // this.itemsService.updateUsersItemCardOptions(options)
  }

  // // only for testing Map in the DOM
  // getItemCardOptionsMap(): ItemCardOption[] {
  //   return Array.from(this.state?.itemCardOptions.values() || []);
  // }
}
