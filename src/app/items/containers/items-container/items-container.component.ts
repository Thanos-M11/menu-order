import { ItemsService } from './../../items.service';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsListComponent } from '../../components/items-list/items-list.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ItemState } from '../../items.state';

@Component({
  selector: 'app-items-container',
  imports: [ItemsListComponent, JsonPipe, AsyncPipe],
  templateUrl: './items-container.component.html',
  styleUrl: './items-container.component.scss',
})
export class ItemsContainerComponent implements OnInit {
  state!: ItemState;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private itemsService: ItemsService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.subscribeToFirstChildRoute();
    this.itemsService.loadState();
    this.itemsService.state$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (st) => (this.state = st),
      });
  }

  handleSelectedItem(itemId: number) {
    this.router.navigate([itemId], { relativeTo: this.activatedRoute });
    this.itemsService.setCurrentItemId(itemId);
  }

  private subscribeToFirstChildRoute(): Subscription | undefined {
    return this.activatedRoute.firstChild?.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (params) => {
          this.itemsService.setCurrentItemId(+params['id']);
        },
      });
  }
}
