import { Routes } from '@angular/router';

export const itemsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'items',
    pathMatch: 'full',
  },
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
            '../items/components/item-card-form/item-card-form.component'
          ).then((c) => c.ItemCardFormComponent),
      },
    ],
  },
];
