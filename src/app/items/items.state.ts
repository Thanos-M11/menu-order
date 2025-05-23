import { Item, Price, Size } from './items.interface';

export type ItemCardOption = Price & { checked: boolean };

export interface CardState {
  currentItemId: number | null;
  currentItemCardOptions: ItemCardOption[];
}

export interface ItemState {
  items: Item[];
  itemSizes: Size[];
  itemPrices: Price[];
  loading: boolean;
  error: string | null;
  cardState: CardState;
}
