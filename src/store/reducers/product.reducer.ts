import { createReducer, on } from '@ngrx/store';
import {
  getProducts,
  getProductsError,
  getProductsSuccess,
  postProduct,
  postProductError,
  postProductSuccess,
} from '../actions/product.actions';
import { IProductState } from '../../core/interfaces/IProduct';

const initialState: IProductState = {
  products: {
    data: [],
    items: 0,
    pages: 0,
  },
  loading: false,
  error: '',
};

export const productReducer = createReducer(
  initialState,

  //get
  on(getProducts, (state) => {
    return { ...state, loading: true };
  }),
  on(getProductsSuccess, (state, { products }) => {
    return { ...state, products, loading: false };
  }),
  on(getProductsError, (state, { error }): IProductState => {
    return {
      ...state,
      products: {
        data: [],
        items: 0,
        pages: 0,
      },
      error,
      loading: false,
    };
  }),

  //post
  on(postProduct, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(postProductSuccess, (state, { product }): IProductState => {
    return {
      ...state,
      products: {
        data: [product, ...state.products.data],
        items: state.products.items + 1,
        pages: state.products.pages,
      },
      loading: false,
    };
  }),
  on(postProductError, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  })
);
