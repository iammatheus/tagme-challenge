export interface IProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
export interface IProduct {
  data: IProductItem[];
  items: number;
  pages: number;
  prev: number;
}

export interface IProductState {
  products: IProduct;
  loading: boolean;
  error: string;
}
