import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    loadChildren: () =>
      import('./pages/products/product.routes').then((m) => m.PRODUCT_ROUTES),
  },
];
