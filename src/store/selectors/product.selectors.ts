import { createSelector } from '@ngrx/store';
import { IAppState } from '../store.state';
import { IProductState } from '../../core/interfaces/IProduct';

export const selectProducts = (state: IAppState) => state.products;

export const selectLoading = createSelector(
  selectProducts,
  (state: IProductState) => state.loading
);

export const selectProductList = createSelector(
  selectProducts,
  (state: IProductState) => state.products
);

export const selectProductListError = createSelector(
  selectProducts,
  (state: IProductState) => state.error
);
