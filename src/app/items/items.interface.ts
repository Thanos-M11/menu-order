export interface Item {
  itemId: number;
  name: string;
}

export interface Size {
  sizeId: number;
  name: string;
}

export interface Price {
  itemId: number;
  sizeId: number;
  price: number;
}

export type ItemCardOption = Price & { sizeName: string; checked: boolean };

export interface ItemState {
  items: Item[];
  itemSizes: Size[];
  itemPrices: Price[];
  loading: boolean;
  error: string | null;
  selectedItemId: number | null;
  itemCardOptions: Map<string, ItemCardOption>;
}
