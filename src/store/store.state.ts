import { ActionReducerMap } from '@ngrx/store';
import { productReducer } from './reducers/product.reducer';
import { IProductState } from '../core/interfaces/IProduct';

export interface IAppState {
  products: Readonly<IProductState>;
}

export const ROOT_REDUCERS: ActionReducerMap<IAppState> = {
  products: productReducer,
};
