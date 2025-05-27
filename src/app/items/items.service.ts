import { DestroyRef, Injectable } from '@angular/core';
import {
  Item,
  ItemCardOption,
  ItemState,
  Price,
  Size,
} from './items.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  forkJoin,
  map,
  MonoTypeOperatorFunction,
  Observable,
  shareReplay,
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
  private itemCardOptionsMapSubject = new BehaviorSubject<
    Map<string, ItemCardOption>
  >(new Map());

  //   public observables item state
  private readonly items$ = this.itemsSubject.asObservable();
  private itemPrices$ = this.itemPricesSubject.asObservable();
  private itemSizes$ = this.itemSizesSubject.asObservable();
  private loading$ = this.loadingSubject.asObservable();
  private error$ = this.errorSubject.asObservable();
  private selectedItemId$ = this.selectedItemIdSubject.asObservable();
  private itemCardOptionsMap$ = this.itemCardOptionsMapSubject.asObservable();

  readonly state$: Observable<ItemState> = combineLatest([
    this.items$,
    this.itemPrices$,
    this.itemSizes$,
    this.loading$,
    this.error$,
    this.selectedItemId$,
    this.itemCardOptionsMap$,
  ]).pipe(
    map(
      ([
        items,
        itemPrices,
        itemSizes,
        loading,
        error,
        selectedItemId,
        itemCardOptionsMap,
      ]) => ({
        items,
        itemPrices,
        itemSizes,
        loading,
        error,
        selectedItemId,
        itemCardOptionsMap,
      })
    ),
    shareReplay(1)
  );

  constructor(private http: HttpClient, private router: Router) {}

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

  loadState(): void {
    this.loadingSubject.next(true);
    forkJoin({
      items: this.readItems$(),
      prices: this.readPrices$(),
      sizes: this.readSizes$(),
    })
      .pipe(
        this.handleHttpError<{ items: Item[]; prices: Price[]; sizes: Size[] }>(
          'Failed to load data'
        )
      )
      .subscribe({
        next: ({ items, prices, sizes }) => {
          this.itemsSubject.next(items),
            this.itemPricesSubject.next(prices),
            this.itemSizesSubject.next(sizes);

          this.itemCardOptionsMapSubject.next(
            this.getItemCardOptionsMap(prices, sizes)
          );
        },
        error: (err: Error) => {
          this.errorSubject.next(`Failed to load data: ${err.message}`);
        },
        complete: () => this.loadingSubject.next(false),
      });
  }

  private getItemCardOptionsMap(
    prices: Price[],
    sizes: Size[]
  ): Map<string, ItemCardOption> {
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
  }

  private readItems$(): Observable<Item[]> {
    if (!this.itemsSubject.getValue().length) {
      return this.http.get<{ items: Item[] }>(this.URL).pipe(
        map((response) => response.items),
        this.handleHttpError<Item[]>('Failed to load items')
      );
    }
    return this.items$;
  }

  private readPrices$(): Observable<Price[]> {
    if (!this.itemPricesSubject.getValue().length) {
      return this.http.get<{ itemPrices: Price[] }>(this.URL).pipe(
        map((response) => response.itemPrices),
        this.handleHttpError<Price[]>('Failed to load prices')
      );
    }
    return this.itemPrices$;
  }

  private readSizes$(): Observable<Size[]> {
    if (!this.itemSizesSubject.getValue().length) {
      return this.http.get<{ itemSizes: Size[] }>(this.URL).pipe(
        map((response) => response.itemSizes),
        this.handleHttpError<Size[]>('Failed to load sizes')
      );
    }
    return this.itemSizes$;
  }

  private handleHttpError<T>(message: string): MonoTypeOperatorFunction<T> {
    return catchError((error: HttpErrorResponse) => {
      console.error(`${message}:`, error);
      return throwError(() => new Error(`${message}: ${error.message}`));
    });
  }
}
