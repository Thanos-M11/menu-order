import { Routes } from '@angular/router';

export const itemsRoutes: Routes = [
  {
    path: 'items',
    loadComponent: () =>
      import('./containers/items-container/items-container.component').then(
        (c) => c.ItemsContainerComponent
      ),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import(
            '../items/components/item-details/item-details.component'
          ).then((c) => c.ItemDetailsComponent),
      },
    ],
  },
];
