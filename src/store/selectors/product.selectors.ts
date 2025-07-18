import { createSelector } from '@ngrx/store';
import { IAppState } from '../store.state';
import { IProductState } from '../../core/interfaces/IProduct';

export const selectProducts = (state: IAppState) => state.products;

export const selectProductLoading = createSelector(
  selectProducts,
  (state: IProductState) => state.loading
);

export const selectProduct = createSelector(
  selectProducts,
  (state: IProductState) => state.products
);

export const selectProductError = createSelector(
  selectProducts,
  (state: IProductState) => state.error
);
