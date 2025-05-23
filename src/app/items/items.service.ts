import { Injectable } from '@angular/core';
import { Item, Price, Size } from './items.interface';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  forkJoin,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { ItemCardOption, ItemState } from './items.state';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private URL = 'assets/json/data.json';

  //   Behavior subjects Item
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  private itemPricesSubject = new BehaviorSubject<Price[]>([]);
  private itemSizesSubject = new BehaviorSubject<Size[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private currentItemIdSubject = new BehaviorSubject<number | null>(null);
  private currentItemCardOptionsSubject = new BehaviorSubject<ItemCardOption[]>(
    []
  );

  //   public observables item state
  public items$ = this.itemsSubject.asObservable();
  public itemPrices$ = this.itemPricesSubject.asObservable();
  public itemSizes$ = this.itemSizesSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // public observables item card
  public currentItemId$ = this.currentItemIdSubject.asObservable();
  public currentItemCardOptions$ =
    this.currentItemCardOptionsSubject.asObservable();

  public state$: Observable<ItemState> = combineLatest([
    this.items$,
    this.itemPrices$,
    this.itemSizes$,
    this.loading$,
    this.error$,
    this.currentItemId$,
    this.currentItemCardOptions$,
  ]).pipe(
    map(
      ([
        items,
        itemPrices,
        itemSizes,
        loading,
        error,
        currentItemId,
        currentItemCardOptions,
      ]) => ({
        items,
        itemPrices,
        itemSizes,
        loading,
        error,
        cardState: {
          currentItemId,
          currentItemCardOptions,
        },
      })
    )
  );

  constructor(private http: HttpClient) {}

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

  setCurrentItemId(itemId: number): void {
    this.currentItemIdSubject.next(itemId);
  }

  getPriceByItemAndBySize$(
    itemId: number,
    sizeId: number
  ): Observable<number | undefined> {
    return this.itemPrices$.pipe(
      map(
        (prices: Price[]) =>
          prices.find(
            (price) => price.itemId === itemId && price.sizeId === sizeId
          )?.price
      )
    );
  }

  getItemCardPrices$(itemId: number): Observable<Price[]> {
    return this.itemPrices$.pipe(
      map((prices: Price[]) =>
        prices.filter((price) => price.itemId === itemId)
      ),
      tap((filteredPrices: Price[]) => {
        const itemCardOptions: ItemCardOption[] = filteredPrices.map(
          (price) => ({
            ...price,
            checked: false,
          })
        );
        this.currentItemCardOptionsSubject.next(itemCardOptions);
      })
    );
  }

  getSizeName$(sizeId: number): Observable<Size | undefined> {
    return this.itemSizes$.pipe(
      map((sizes: Size[]) => sizes.find((size: Size) => size.sizeId === sizeId))
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
