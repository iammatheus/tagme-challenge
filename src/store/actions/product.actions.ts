import { createAction, props } from '@ngrx/store';
import { IProduct, IProductItem } from '../../core/interfaces/IProduct';

// get
export const getProducts = createAction(
  '[PRODUCT] GET',
  props<{ pageIndex: number; pageSize: number }>()
);
export const getProductsSuccess = createAction(
  '[PRODUCT] GET SUCCESS',
  props<{ products: IProduct }>()
);
export const getProductsError = createAction(
  '[PRODUCT] GET ERROR',
  props<{ error: string }>()
);

// post
export const postProduct = createAction(
  '[PRODUCT] POST',
  props<{ product: IProductItem }>()
);
export const postProductSuccess = createAction(
  '[PRODUCT] POST SUCCESS',
  props<{ product: IProductItem }>()
);
export const postProductError = createAction(
  '[PRODUCT] POST ERROR',
  props<{ error: string }>()
);
