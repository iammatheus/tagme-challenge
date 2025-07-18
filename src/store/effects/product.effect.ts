import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import {
  getProducts,
  getProductsSuccess,
  getProductsError,
} from '../actions/product.actions';
import { ProductService } from '../../app/pages/products/services/product.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class ProductsEffects {
  loadProduct = createEffect(
    (actions$ = inject(Actions), productService = inject(ProductService)) => {
      return actions$.pipe(
        ofType(getProducts.type),
        exhaustMap(({ pageIndex, pageSize }) =>
          productService.get(pageIndex, pageSize).pipe(
            map((products) => getProductsSuccess({ products })),
            catchError((error: string) => of(getProductsError({ error })))
          )
        )
      );
    }
  );
}
