import { createAction, props } from '@ngrx/store';
import { IProduct } from '../../core/interfaces/IProduct';

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
