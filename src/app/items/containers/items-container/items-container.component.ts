import { ItemsService } from './../../items.service';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ItemsListComponent } from '../../components/items-list/items-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { ItemState } from '../../items.interface';

@Component({
  selector: 'app-items-container',
  imports: [ItemsListComponent, JsonPipe],
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (st) => (this.state = st),
      });
  }

  handleSelectedItem(itemId: number) {
    this.itemsService.setCurrentItemId(itemId);
    this.itemsService.navigateTo([itemId.toString()], this.activatedRoute);
  }
}
