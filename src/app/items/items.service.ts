import { DestroyRef, Injectable } from '@angular/core';
import {
  Item,
  ItemCardOption,
  ItemState,
  Price,
  Size,
} from './items.interface';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  forkJoin,
  map,
  Observable,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private URL = 'assets/json/data.json';

  //   Behavior subjects Item
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  private itemPricesSubject = new BehaviorSubject<Price[]>([]);
  private itemSizesSubject = new BehaviorSubject<Size[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private selectedItemIdSubject = new BehaviorSubject<number | null>(null);

  //   public observables item state
  private items$ = this.itemsSubject.asObservable();
  private itemPrices$ = this.itemPricesSubject.asObservable();
  private itemSizes$ = this.itemSizesSubject.asObservable();
  private loading$ = this.loadingSubject.asObservable();
  private error$ = this.errorSubject.asObservable();
  private selectedItemId$ = this.selectedItemIdSubject.asObservable();

  private itemCardOptions$ = combineLatest([
    this.itemPrices$,
    this.itemSizes$,
  ]).pipe(
    map(([prices, sizes]) => {
      const itemCardOptionsMap = new Map<string, ItemCardOption>();

      prices.forEach((price: Price) => {
        const key = `${price.itemId}-${price.sizeId}`;
        const value: ItemCardOption = {
          itemId: price.itemId,
          sizeId: price.sizeId,
          sizeName:
            sizes.find((size) => size.sizeId === price.sizeId)?.name || '',
          price: price.price,
          checked: true,
        };
        itemCardOptionsMap.set(key, value);
      });
      return itemCardOptionsMap;
    }),
    shareReplay(1)
  );

  public state$: Observable<ItemState> = combineLatest([
    this.items$,
    this.itemSizes$,
    this.itemPrices$,
    this.loading$,
    this.error$,
    this.selectedItemId$,
    this.itemCardOptions$,
  ]).pipe(
    map(
      ([
        items,
        itemSizes,
        itemPrices,
        loading,
        error,
        selectedItemId,
        itemCardOptions,
      ]) => ({
        items,
        itemSizes,
        itemPrices,
        loading,
        error,
        selectedItemId,
        itemCardOptions,
      })
    ),
    shareReplay(1)
  );

  constructor(private http: HttpClient, private router: Router) {}

  public loadState(): void {
    this.loadingSubject.next(true);
    forkJoin({
      items: this.readItems$(),
      itemPrices: this.readPrices$(),
      itemSizes: this.readSizes$(),
    })
      .pipe(
        tap(() => {
          this.loadingSubject.next(false);
        }),
        catchError((err) => {
          this.loadingSubject.next(false);
          this.errorSubject.next(err.message);
          return throwError(() => new Error(err));
        })
      )
      .subscribe();
  }

  setCurrentItemId(itemId: number | null): void {
    this.selectedItemIdSubject.next(itemId);
  }

  navigateTo(path: string[], route?: ActivatedRoute): void {
    this.router.navigate(path, { relativeTo: route });
  }

  getRouteParams$(
    activatedRoute: ActivatedRoute,
    destroyRef: DestroyRef
  ): Observable<Params> {
    return (
      activatedRoute.firstChild?.params.pipe(takeUntilDestroyed(destroyRef)) ??
      EMPTY
    );
  }

  private readItems$(): Observable<Item[]> {
    if (!this.itemsSubject.getValue().length) {
      return this.http.get<{ items: Item[] }>(this.URL).pipe(
        map((res) => res.items),
        tap((items: Item[]) => {
          this.itemsSubject.next(items);
        })
      );
    }
    return this.items$;
  }

  private readPrices$(): Observable<Price[]> {
    if (!this.itemPricesSubject.getValue().length) {
      return this.http.get<{ itemPrices: Price[] }>(this.URL).pipe(
        map((res) => res.itemPrices),
        tap((prices: Price[]) => this.itemPricesSubject.next(prices))
      );
    }
    return this.itemPrices$;
  }

  private readSizes$(): Observable<Size[]> {
    if (!this.itemSizesSubject.getValue().length) {
      return this.http.get<{ itemSizes: Size[] }>(this.URL).pipe(
        map((res) => res.itemSizes),
        tap((sizes: Size[]) => this.itemSizesSubject.next(sizes))
      );
    }
    return this.itemSizes$;
  }
}
