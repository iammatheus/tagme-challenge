import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { exhaustMap, catchError, map } from 'rxjs/operators';
import {
  getProducts,
  getProductsSuccess,
  getProductsError,
  postProduct,
  postProductSuccess,
  postProductError,
} from '../actions/product.actions';
import { ProductService } from '../../app/pages/products/services/product.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class ProductsEffects {
  actions$ = inject(Actions);
  productService = inject(ProductService);

  loadProduct = createEffect(() => {
    return this.actions$.pipe(
      ofType(getProducts.type),
      exhaustMap(({ pageIndex, pageSize }) =>
        this.productService.get(pageIndex, pageSize).pipe(
          map((products) => getProductsSuccess({ products })),
          catchError(() =>
            of(getProductsError({ error: 'Erro ao carregar produtos.' }))
          )
        )
      )
    );
  });

  postProduct = createEffect(() => {
    return this.actions$.pipe(
      ofType(postProduct.type),
      exhaustMap(({ product }) =>
        this.productService.post(product).pipe(
          map((product) => postProductSuccess({ product })),
          catchError(() => {
            return of(
              postProductError({ error: 'Erro ao cadastrar produto.' })
            );
          })
        )
      )
    );
  });
}
